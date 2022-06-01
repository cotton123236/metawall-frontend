<script setup>
import "swiper/css";
import { watch } from "vue";
import { reactive, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { signIn, getMyProfile, signUpCheck, signUp } from "./../api/fetch";

import {
  isNotEmpty,
  isValidEmail,
  isValidPassword,
  isSamePassword,
} from "../utils/validate";
import { useUserStore } from "./../stores/userStore";
import { Swiper, SwiperSlide } from "swiper/vue";
import LogoLarge from "./../assets/image/logo-large.svg";
<<<<<<< HEAD
import googleLogo from "./../assets/image/google-logo.png";
=======
const router = useRouter();
>>>>>>> 232108e (refact: login 程式邏輯整理)
const userStore = useUserStore();
const { patchUser } = userStore;
const { VITE_GOOGLE_OAUTH_LOGIN_URL } = import.meta.env;

// oauth Login URL
const googleOAuthLoginURL = VITE_GOOGLE_OAUTH_LOGIN_URL;
// 錯誤訊息
const errorMessage = reactive({
  nickName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const apiErrorMessage = ref(" ");

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
const slideUpdate = () => {
  setTimeout(() => {
    signupSwiperInstance.value.update();
  }, 100);
};

/* ---登入功能--- */

// 登入表單
const loginForm = reactive({
  email: "",
  password: "",
});

// 監看 loginForm 內容
watch(
  loginForm,
  (newVal) => {
    // 驗證 email 格式
    errorMessage.email = isValidEmail(newVal.email);
  },
  { deep: true }
);

// 登入功能
const login = async () => {
  // 驗證：內容不可為空
  errorMessage.email = isNotEmpty(loginForm.email);
  errorMessage.password = isNotEmpty(loginForm.password);
  if (errorMessage.email || errorMessage.password) return;

  // 驗證： Email 格式
  errorMessage.email = isValidEmail(loginForm.email);
  if (errorMessage.email) return;

  const { data } = await signIn(loginForm);
  if (data.status === "success") {
    localStorage.setItem("token", data.data.token);

    const { data: profileData } = await getMyProfile();
    if (profileData.status === "success") {
      patchUser({
        _id: profileData.data._id,
        name: profileData.data.nickName,
        image: profileData.data.avatar,
      });
      router.push({ path: "/" });

      // 清空錯誤訊息
      errorMessage.email = "";
      errorMessage.password = "";
    }
  } else {
    console.log("data", data);
    apiErrorMessage.value = data.message;
  }
};

/* ---註冊功能--- */
// 註冊表單
const registerForm = reactive({
  nickName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// 監看 registerForm 內容
watch(
  registerForm,
  (newVal) => {
    // 驗證 Email 格式
    errorMessage.email = isValidEmail(newVal.email);

    // 驗證密碼格式
    errorMessage.password = isValidPassword(newVal.password);

    // 確認密碼是否一致
    errorMessage.confirmPassword = isSamePassword(
      newVal.password,
      newVal.confirmPassword
    );
  },
  { deep: true }
);

watch(
  () => registerForm.nickName,
  (newVal, oldVal) => {
    errorMessage.nickName = isNotEmpty(newVal);
  }
);

watch(errorMessage.value, () => {
  slideUpdate();
});

watch(apiErrorMessage, () => {
  console.log("apiErr");
  slideUpdate();
});

// 註冊檢查
const registerPreCheck = async () => {
  // 驗證：內容不可為空
  errorMessage.email = isNotEmpty(registerForm.email);
  errorMessage.password = isNotEmpty(registerForm.password);
  errorMessage.confirmPassword = isNotEmpty(registerForm.confirmPassword);
  if (
    errorMessage.email ||
    errorMessage.password ||
    errorMessage.confirmPassword
  )
    return;

  // 驗證： Email 格式
  errorMessage.email = isValidEmail(registerForm.email);
  if (errorMessage.email) return;

  // 驗證： 密碼不一致
  errorMessage.confirmPassword = isSamePassword(
    registerForm.password,
    registerForm.confirmPassword
  );
  if (errorMessage.confirmPassword) return;

  // 驗證： 密碼少於8個字元
  errorMessage.password = isValidPassword(registerForm.password);
  if (errorMessage.password) return;

  const { data } = await signUpCheck(registerForm);

  if (data.status === "success") {
    apiErrorMessage.value = "";
    slideNext();
  } else {
    apiErrorMessage.value = data.message;
  }
};

// 註冊
const register = async () => {
  // 驗證：內容不可為空
  errorMessage.nickName = isNotEmpty(registerForm.nickName);
  if (errorMessage.nickName) return;

  const { data } = await signUp(registerForm);

  if (data.status === "success") {
    localStorage.setItem("token", data.data.token);

    const { data: profileData } = await getMyProfile();
    if (profileData.status === "success") {
      patchUser({
        _id: profileData.data._id,
        name: profileData.data.nickName,
      });
      router.push({ path: "/" });

      // 清空錯誤訊息
      errorMessage.nickName = "";
      errorMessage.email = "";
      errorMessage.password = "";
      errorMessage.confirmPassword = "";
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
                  v-model.trim="loginForm.email"
                />
                <span>Email</span>
              </label>
              <label class="form-row" :data-warning="errorMessage.password">
                <input
                  id="login-password"
                  type="password"
                  required
                  @keyup.enter="login"
                  @keydown.tab.prevent
                  v-model.trim="loginForm.password"
                />
                <span>Password</span>
              </label>
              <div class="api-error">{{ apiErrorMessage }}</div>
              <div
                class="rect-btn fill login-btn"
                @keyup.enter="login"
                @click="login"
              >
                登入
              </div>
              <div class="rect-btn signup-btn" @click="slideNext">註冊</div>
              <div class="line" data-text="or"></div>
              <div class="rect-btn">
                <img class="google-logo" :src="googleLogo" alt="" />
                Login with Google
              </div>
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
                  v-model.trim="registerForm.email"
                />
                <span>Email</span>
              </label>
              <label class="form-row" :data-warning="errorMessage.password">
                <input
                  id="signup-password"
                  type="password"
                  required
                  v-model.trim="registerForm.password"
                />
                <span>Password</span>
              </label>
              <label
                class="form-row"
                :data-warning="errorMessage.confirmPassword"
              >
                <input id="confirm-password" type="password" required <<<<<<<
                HEAD v-model.trim="registerForm.confirmPassword"
                @keyup.enter="registerPreCheck" ======= @keydown.tab.prevent
                v-model="registerForm.confirmPassword" >>>>>>> 232108e (refact:
                login 程式邏輯整理) />
                <span>Confirm Password</span>
              </label>
              <div class="api-error">{{ apiErrorMessage }}</div>
              <div class="rect-btn signup-btn fill" @click="registerPreCheck">
                註冊
              </div>
              <div class="rect-btn login-btn" @click="slidePrev">登入</div>
              <div class="line" data-text="or"></div>
              <div class="rect-btn">
                <img class="google-logo" :src="googleLogo" alt="" />
                Sign up with Google
              </div>
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
                  @keydown.tab.prevent
                  v-model.trim="registerForm.nickName"
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
@import ./../assets/sass/base/variables
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
  padding: 50px 40px
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
    margin-top: 20px
    width: 100%
  .api-error
    display: flex
    justify-content: center
    margin-top: 20px
    font-size: px(12)
    line-height: 1.5
    color: var(--warning)
    font-size: 0.875rem
  .rect-btn
    margin-top: 20px
    & + .rect-btn
      margin-top: 10px
  .line
    position: relative
    width: 100%
    height: 1px
    background-color: #eee
    margin: 20px 0
    & + .rect-btn
      margin-top: 0
    &::before
      display: block
      content: attr(data-text)
      font-size: px(14)
      font-family: $code-font
      color: var(--light-gray)
      padding: 0 10px
      background-color: #fff
      +posCenter
</style>