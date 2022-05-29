<script setup>
import "swiper/css";
import { watch } from "vue";
import { ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { signIn, getMyProfile, signUpCheck, signUp } from "./../api/fetch";
import validator from "validator";
import { useUserStore } from "./../stores/userStore";
import { Swiper, SwiperSlide } from "swiper/vue";
import LogoLarge from "./../assets/image/logo-large.svg";
const userStore = useUserStore();
const { patchUser } = userStore;

// 錯誤訊息
const errorMessage = ref({
  nickName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const apiErrorMessage = ref(" ");

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
  apiErrorMessage.value = "";
  signupSwiperInstance.value.slideNext();
};

/* ---登入功能--- */

// 登入表單
const loginForm = ref({
  email: "",
  password: "",
});

// 監看 email 格式
watch(
  () => loginForm.value.email,
  (newVal, oldVal) => {
    errorMessage.value.email = !validator.isEmail(newVal.trim())
      ? "Email 格式錯誤"
      : "";
  }
);

// 登入功能
const login = async () => {
  // 驗證：內容不可為空
  if (!loginForm.value.email.trim() || !loginForm.value.password.trim()) {
    errorMessage.value.email = "請填寫內容";
    errorMessage.value.password = "請填寫內容";
    return;
  }

  // 驗證： Email 格式
  if (!validator.isEmail(loginForm.value.email.trim())) {
    errorMessage.value.email = "Email 格式錯誤";
    return;
  }

  const { data } = await signIn(loginForm.value);
  if (data.status === "success") {
    localStorage.setItem("token", data.data.token);

    const { data: profileData } = await getMyProfile();
    if (profileData.status === "success") {
      patchUser({
        _id: profileData.data._id,
        name: profileData.data.nickName,
        image: profileData.data.hasOwnProperty("avatar")
          ? profileData.data.avatar
          : "@/assets/image/logo.png",
      });
      router.push({ path: "/" });

      // 清空錯誤訊息
      errorMessage.value.email = "";
      errorMessage.value.password = "";
    }
  } else {
    console.log("data", data);
    apiErrorMessage.value = data.message;
  }
};

/* ---註冊功能--- */
// 註冊表單
const registerForm = ref({
  nickName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// 監看 email 格式
watch(
  () => registerForm.value.email,
  (newVal, oldVal) => {
    errorMessage.value.email = !validator.isEmail(newVal.trim())
      ? "Email 格式錯誤"
      : "";
  }
);

// 監看 password 格式
watch(
  () => registerForm.value.password,
  (newVal, oldVal) => {
    errorMessage.value.password = !validator.isLength(newVal.trim(), { min: 8 })
      ? "密碼需大於8個字元"
      : "";
  }
);

// 監看 confirmPassword 格式
watch(
  () => registerForm.value.confirmPassword,
  (newVal, oldVal) => {
    errorMessage.value.confirmPassword =
      registerForm.value.password.trim() !== newVal.trim() ? "密碼不一致" : "";
  }
);

// 註冊檢查
const registerPreCheck = async () => {
  // 驗證：內容不可為空
  if (
    !registerForm.value.email.trim() ||
    !registerForm.value.password.trim() ||
    !registerForm.value.confirmPassword.trim()
  ) {
    errorMessage.value.email = "請填寫內容";
    errorMessage.value.password = "請填寫內容";
    errorMessage.value.confirmPassword = "請填寫內容";
    return;
  }

  // 驗證： Email 格式
  if (!validator.isEmail(registerForm.value.email.trim())) {
    errorMessage.value.email = "Email 格式錯誤";
    return;
  }

  // 驗證： 密碼不一致
  if (
    registerForm.value.password.trim() !==
    registerForm.value.confirmPassword.trim()
  ) {
    errorMessage.value.confirmPassword = "密碼不一致";
    return;
  }

  // 驗證： 密碼少於8個字元
  if (!validator.isLength(registerForm.value.password.trim(), { min: 8 })) {
    errorMessage.value.confirmPassword = "密碼少於8個字元";
    return;
  }

  const { data } = await signUpCheck(registerForm.value);

  if (data.status === "success") {
    apiErrorMessage.value = "";
    slideNext();
  }
};

// 註冊
const register = async () => {
  // 驗證：內容不可為空
  if (!registerForm.value.nickName.trim()) {
    errorMessage.value.nickName = "請填寫內容";
    return;
  }

  const { data } = await signUp(registerForm.value);

  if (data.status === "success") {
    localStorage.setItem("token", data.data.token);

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

      // 清空錯誤訊息
      errorMessage.value.nickName = "";
      errorMessage.value.email = "";
      errorMessage.value.password = "";
      errorMessage.value.confirmPassword = "";
    }
  }
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
              <label class="form-row" :data-warning="errorMessage.email">
                <input
                  id="login-email"
                  type="text"
                  required
                  v-model="loginForm.email"
                />
                <span>Email</span>
              </label>
              <label class="form-row" :data-warning="errorMessage.password">
                <input
                  id="login-password"
                  type="password"
                  required
                  v-model="loginForm.password"
                />
                <span>Password</span>
              </label>
              <div class="api-error">{{ apiErrorMessage }}</div>
              <div class="rect-btn fill login-btn" @click="login">登入</div>
              <div class="rect-btn signup-btn" @click="slideNext">註冊</div>
            </form>
          </swiper-slide>
          <!-- sign-up email & password -->
          <swiper-slide>
            <p class="brief">註冊加入元宇宙！</p>
            <form>
              <label class="form-row" :data-warning="errorMessage.email">
                <input
                  id="signup-email"
                  type="text"
                  required
                  v-model="registerForm.email"
                />
                <span>Email</span>
              </label>
              <label class="form-row" :data-warning="errorMessage.password">
                <input
                  id="signup-password"
                  type="password"
                  required
                  v-model="registerForm.password"
                />
                <span>Password</span>
              </label>
              <label
                class="form-row"
                :data-warning="errorMessage.confirmPassword"
              >
                <input
                  id="confirm-password"
                  type="password"
                  required
                  v-model="registerForm.confirmPassword"
                />
                <span>Confirm Password</span>
              </label>
              <div class="api-error">{{ apiErrorMessage }}</div>
              <div class="rect-btn signup-btn fill" @click="registerPreCheck">
                註冊
              </div>
              <div class="rect-btn login-btn" @click="slidePrev">登入</div>
            </form>
          </swiper-slide>
          <!-- sign-up name -->
          <swiper-slide>
            <p class="brief">建立屬於你的元宇宙名稱！</p>
            <form>
              <label class="form-row" :data-warning="errorMessage.nickName">
                <input
                  id="signup-name"
                  type="text"
                  required
                  v-model="registerForm.nickName"
                />
                <span>Name</span>
              </label>
              <div class="api-error">{{ apiErrorMessage }}</div>
              <div class="rect-btn signup-btn fill" @click="register">
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
  .api-error
    display: flex
    justify-content: center
    margin-top: 20px
    color: var(--warning)
    font-size: 0.875rem
  .rect-btn
    margin-top: 40px
    & + .rect-btn
      margin-top: 10px
</style>