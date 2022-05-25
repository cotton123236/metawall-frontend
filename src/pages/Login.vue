<script setup>
import "swiper/css";
import { ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { signIn, getMyProfile } from "./../api/fetch";
import validator from "validator";
import { useUserStore } from "./../stores/userStore";
import { Swiper, SwiperSlide } from "swiper/vue";
import LogoLarge from "./../assets/image/logo-large.svg";
const userStore = useUserStore();
const { patchUser } = userStore;
// 註冊表單
const form = ref({
  email: "",
  password: "",
});

const errorMessage = ref({
  email: "",
  password: "",
});

const router = useRouter();
// login mode control
const signupSwiperInstance = ref(null);
const signupSwiperInit = (swiper) => {
  signupSwiperInstance.value = swiper;
};
const slidePrev = () => {
  signupSwiperInstance.value.slidePrev();
};
const slideNext = () => {
  signupSwiperInstance.value.slideNext();
};
const login = async () => {
  // 驗證：內容不可為空
  if (!form.value.email || !form.value.password) {
    errorMessage.value.email = "請填寫內容";
    errorMessage.value.password = "請填寫內容";
    return;
  }

  // 驗證： Email 格式
  if (!validator.isEmail(form.value.email)) {
    errorMessage.value.email = "Email 格式錯誤";
    return;
  }

  const { data } = await signIn(form.value);

  if (data.status === "success") {
    localStorage.setItem("token", data.token);

    const { data: profileData } = await getMyProfile();
    if (profileData.status === "success") {
      patchUser({
        _id: profileData.data._id,
        name: profileData.data.nickName,
        image: profileData.data.hasOwnProperty("avatar")
          ? profileData.data.avatar
          : "",
      });
      router.push({ path: "/" });
    }
  }
};
const signupSuccess = () => {
  router.push({ path: "/" });
};
</script>

<template>
  <main class="space-lr">
    <div class="login-wrap">
      <div class="inner">
        <div class="logo">
          <img :src="LogoLarge" alt="" />
        </div>
        <!-- login & sign-up -->
        <swiper
          class="swiper-no-swiping"
          ref="signSwiper"
          :auto-height="true"
          :space-between="50"
          @after-init="signupSwiperInit"
        >
          <!-- login -->
          <swiper-slide>
            <p class="brief">到元宇宙展開你的全新社交圈！</p>
            <form>
              <label :data-warning="errorMessage.email">
                <input id="email" type="text" required v-model="form.email" />
                <span>Email</span>
              </label>
              <label :data-warning="errorMessage.password">
                <input
                  id="password"
                  type="password"
                  required
                  v-model="form.password"
                />
                <span>Password</span>
              </label>

              <div class="rect-btn fill login-btn" @click="login">登入</div>
              <div class="rect-btn signup-btn" @click="slideNext">註冊</div>
            </form>
          </swiper-slide>
          <!-- sign-up email & password -->
          <swiper-slide>
            <p class="brief">註冊加入元宇宙！</p>
            <form>
              <label data-warning>
                <input id="email" type="text" required />
                <span>Email</span>
              </label>
              <label>
                <input id="password" type="password" required />
                <span>Password</span>
              </label>
              <label>
                <input id="confirm-password" type="password" required />
                <span>Confirm Password</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="slideNext">
                註冊
              </div>
              <div class="rect-btn login-btn" @click="slidePrev">登入</div>
            </form>
          </swiper-slide>
          <!-- sign-up name -->
          <swiper-slide>
            <p class="brief">建立屬於你的元宇宙名稱！</p>
            <form>
              <label data-warning>
                <input id="name" type="text" required />
                <span>Name</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="signupSuccess">
                開啟元宇宙
              </div>
              <div class="rect-btn signup-btn" @click="slidePrev">回上一步</div>
            </form>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </main>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/mixin
main
  display: flex
  flex-direction: column
  min-height: 100vh
  padding-top: 60px
  padding-bottom: 60px
.login-wrap
  margin: auto
  width: 100%
  max-width: 400px
  padding: 60px 40px
  border: 1px solid var(--dark-white)
  border-radius: 12px
  background-color: #fff
  box-shadow: 0 0 15px rgba(0, 0, 0, .2)
  .logo
    width: 100px
    margin: auto
  .swiper
    margin-top: 20px
  .brief
    font-size: px(14)
    line-height: 1.5
    color: var(--light-gray)
    text-align: center
  form
    display: flex
    flex-direction: column
    margin-top: 40px
    width: 100%
  .rect-btn
    margin-top: 40px
    & + .rect-btn
      margin-top: 10px
</style>