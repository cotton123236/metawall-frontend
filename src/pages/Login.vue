<script setup>
import "swiper/css";
import { watch } from "vue";
import { reactive, ref, onMounted , onBeforeUnmount } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { signIn, getMyProfile, signUpCheck, signUp, forgetPassword, verification, changePassword } from "./../api/fetch";
import {
  isNotEmpty,
  isValidEmail,
  isValidPassword,
  isSamePassword,
} from "../utils/validate";
import { useUserStore } from "./../stores/userStore";
import { useModalStore } from "./../stores/modalStore";
import { Swiper, SwiperSlide } from "swiper/vue";
// img
import LogoLarge from "./../assets/image/logo-large.svg";
import googleLogo from "./../assets/image/google-logo.png";
import discordLogo from './../assets/image/discord-logo.svg';
import facebookLogo from './../assets/image/facebook-logo.svg';
import lineLogo from './../assets/image/line-logo.svg';
import loginBg from "./../assets/image/login-bg.png";
import rock_01 from "./../assets/image/rock-01.svg";
import rock_02 from "./../assets/image/rock-02.svg";
import rock_03 from "./../assets/image/rock-03.svg";
import rock_04 from "./../assets/image/rock-04.svg";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const modalStore = useModalStore();
const { patchUser } = userStore;
const { openModalLoader, closeModalLoader, openModalAlert } = modalStore;
const { 
  VITE_GOOGLE_OAUTH_LOGIN_URL,
  VITE_DISCORD_OAUTH_LOGIN_URL,
  VITE_LINE_OAUTH_LOGIN_URL,
  VITE_FACEBOOK_OAUTH_LOGIN_URL,
} = import.meta.env;

// oauth Login URL
const googleOAuthLoginURL = VITE_GOOGLE_OAUTH_LOGIN_URL;
const discordOAuthLoginURL = VITE_DISCORD_OAUTH_LOGIN_URL;
const lineOAuthLoginURL = VITE_LINE_OAUTH_LOGIN_URL;
const facebookOAuthLoginURL = VITE_FACEBOOK_OAUTH_LOGIN_URL;
// 錯誤訊息
const errorMessage = reactive({
  nickName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
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
const slideUpdate = () => {
  setTimeout(() => {
    signupSwiperInstance.value.update();
  }, 100);
};
const slideTo = (index) => {
  signupSwiperInstance.value.slideTo(index, 0, false); //切换到第一个slide，速度为1秒
};

onMounted(() => {
  if(isVerificationMode(route.query?.mode) && route.query?.verificationId){
    goVerificationSlide()
  }
})

onBeforeUnmount(() => {
  resetEnableSendEmailBtnTimer();
})
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

  // 通過前端驗證
  openModalLoader();
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
  }
  // 關閉 loader
  closeModalLoader();
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

watch(errorMessage, () => {
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

  openModalLoader();
  const { data } = await signUpCheck(registerForm);

  // 通過前端驗證
  if (data.status === "success") {
    slideNext();
  }
  // 關閉 loader
  closeModalLoader();
};

// 註冊
const register = async () => {
  // 驗證：內容不可為空
  errorMessage.nickName = isNotEmpty(registerForm.nickName);
  if (errorMessage.nickName) return;

  const { data } = await signUp(registerForm);
  openModalLoader();
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
  // 關閉 loader
  closeModalLoader();
};

/* ---忘記密碼功能--- */
// 忘記密碼表單
const isEmailSent = ref(false);
const enableSendEmailBtnTime = ref(60);
let enableSendEmailBtnTimer = null;

const countdown = () =>{
  enableSendEmailBtnTime.value--;
  if(enableSendEmailBtnTime.value===0){
    isEmailSent.value = false;
    resetEnableSendEmailBtnTimer()
  }
}

const resetEnableSendEmailBtnTimer = () => {
  enableSendEmailBtnTime.value = 60
  clearInterval(enableSendEmailBtnTimer);
}

const forgetPasswordForm = reactive({
  email: "",
});

// 監看 registerForm 內容
watch(
  forgetPasswordForm,
  (newVal) => {
    // 驗證 Email 格式
    errorMessage.email = isValidEmail(newVal.email);
  },
  { deep: true }
);

const sendForgetPassword = async () => {
  if(isEmailSent.value) return;
  // 驗證：內容不可為空
  errorMessage.email = isNotEmpty(forgetPasswordForm.email);
  if (errorMessage.email) return;

  isEmailSent.value = true;
  slideUpdate();
  enableSendEmailBtnTimer=setInterval(countdown, 1000);
  const result = await forgetPassword(forgetPasswordForm);
}

// 驗證碼表單
const verificationForm = reactive({
  verificationCode: "",
});

// 監看 verificationForm 內容
watch(
  verificationForm,
  (newVal) => {
    // 驗證 Email 格式
    errorMessage.verificationCode = isNotEmpty(newVal.verificationCode);
  },
  { deep: true }
);

const checkVerificationCode = async() => {

  errorMessage.verificationCode = isNotEmpty(verificationForm.verificationCode);
  if (errorMessage.verificationCode) return;

  const {data} = await verification({
    data: {
      verificationId:route.query.verificationId,
      verificationCode:verificationForm.verificationCode
    }
  })
  
  if(!data.data.token){
    openModalAlert("沒有找到 token")
  }
  const token = data.data.token
  localStorage.setItem("token", token)
  // 通過前端驗證
  if (data.status === "success") {
    slideNext();
  }
}


const isVerificationMode = (mode) => {
  return mode==="verification"
}

const goVerificationSlide = () => {
  slideTo(4)
}

// 更新密碼表單
const changePasswordForm = reactive({
  newPassword: "",
  confirmNewPassword: "",
});

// 監看 changePasswordForm 內容
watch(
  changePasswordForm,
  (newVal) => {
    // 驗證密碼格式
    errorMessage.newPassword = isValidPassword(newVal.newPassword);
    errorMessage.confirmNewPassword = isValidPassword(newVal.confirmNewPassword);

    // 確認密碼是否一致
    errorMessage.confirmPassword = isSamePassword(
      newVal.newPassword,
      newVal.confirmNewPassword
    );
  },
  { deep: true }
);

const onChangePassword = async () => {
  const {data} = await changePassword({
    password:changePasswordForm.newPassword,
    confirmPassword:changePasswordForm.confirmNewPassword
  })
  if(data.status==="success"){
    router.push({ path: "/" });
  }
}

</script>

<template>
  <main class="space-lr">
    <div class="bg-wrap" data-aos="fade" data-aos-duration="800">
      <img class="bg" :src="loginBg" alt="" />
      <img class="rock rock-01" :src="rock_01" alt="" />
      <img class="rock rock-02" :src="rock_02" alt="" />
      <img class="rock rock-03" :src="rock_03" alt="" />
      <img class="rock rock-04" :src="rock_04" alt="" />
    </div>
    <div
      class="login-wrap"
      data-aos="clip-down"
      data-aos-duration="1000"
      data-aos-delay="500"
    >
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
              <div
                class="rect-btn fill login-btn"
                @keyup.enter="login"
                @click="login"
              >
                登入
              </div>
              <div class="rect-btn signup-btn" @click="slideNext">註冊</div>
              <div class="line">or</div>
              <div class="third-party">
                <a :href="discordOAuthLoginURL">
                  <img class="discord-logo" :src="discordLogo" alt="" />
                </a>
                <a :href="lineOAuthLoginURL">
                  <img class="line-logo" :src="lineLogo" alt="" />
                </a>
                <a :href="googleOAuthLoginURL">
                  <img class="google-logo" :src="googleLogo" alt="" />
                </a>
                <a :href="facebookOAuthLoginURL">
                  <img class="facebook-logo" :src="facebookLogo" alt="" />
                </a>
              </div> 
            </form>
            <div class="forget-password-warp">
              <a class="forget-password-link text-primary-blue text-primary-blue-light--hover link-underline--hover" @click="slideTo(3)">忘記密碼</a>
            </div>
          </swiper-slide>
          <!-- sign-up email & password -->
          <swiper-slide>
            <p class="brief">註冊加入元宇宙！</p>
            <form>
              <label class="form-row" :data-warning="errorMessage.email">
                <input
                  type="text"
                  required
                  v-model.trim="registerForm.email"
                />
                <span>Email</span>
              </label>
              <label class="form-row" :data-warning="errorMessage.password">
                <input
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
                <input
                  id="confirm-password"
                  type="password"
                  required
                  v-model.trim="registerForm.confirmPassword"
                  @keydown.tab.prevent
                  @keyup.enter="registerPreCheck"
                />
                <span>Confirm Password</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="registerPreCheck">
                註冊
              </div>
              <div class="rect-btn login-btn" @click="slidePrev">登入</div>
              <div class="line">or</div>
              <div class="third-party">
                <a :href="discordOAuthLoginURL">
                  <img class="discord-logo" :src="discordLogo" alt="" />
                </a>
                <a :href="lineOAuthLoginURL">
                  <img class="line-logo" :src="lineLogo" alt="" />
                </a>
                <a :href="googleOAuthLoginURL">
                  <img class="google-logo" :src="googleLogo" alt="" />
                </a>
                <a :href="facebookOAuthLoginURL">
                  <img class="facebook-logo" :src="facebookLogo" alt="" />
                </a>
              </div>              
            </form>
          </swiper-slide>
          <!-- sign-up name -->
          <swiper-slide>
            <p class="brief">建立屬於你的元宇宙名稱！</p>
            <form>
              <label class="form-row" :data-warning="errorMessage.nickName">
                <input
                  type="text"
                  required
                  @keydown.tab.prevent
                  v-model.trim="registerForm.nickName"
                />
                <span>Name</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="register">
                開啟元宇宙
              </div>
              <div class="rect-btn signup-btn" @click="slidePrev">回上一步</div>
            </form>
          </swiper-slide>
          <swiper-slide>
            <p class="brief">請輸入你的 Email</p>
            <form>
              <label class="form-row" :data-warning="errorMessage.email">
                <input
                  type="text"
                  required
                  @keydown.tab.prevent
                  v-model.trim="forgetPasswordForm.email"
                />
                <span>Email</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="sendForgetPassword" :class="{disable: isEmailSent}">
                發送驗證碼到信箱
              </div>
              <div class="msg" v-show="isEmailSent">重新發送驗證碼等待時間 {{ enableSendEmailBtnTime }} 秒</div>
              <div class="rect-btn signup-btn" @click="slideTo(0)">回上一步</div>
            </form>
          </swiper-slide>
          <swiper-slide>
            <p class="brief">請輸入你的驗證碼</p>
            <form>
              <label class="form-row" :data-warning="errorMessage.verificationCode">
                <input
                  type="text"
                  required
                  @keydown.tab.prevent
                  v-model.trim="verificationForm.verificationCode"
                />
                <span>驗證碼</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="checkVerificationCode">
                確認
              </div>
            </form>
          </swiper-slide>
          <swiper-slide>
            <p class="brief">請輸入新的密碼</p>
            <form>
              <label class="form-row" :data-warning="errorMessage.newPassword">
                <input
                  type="password"
                  required
                  v-model.trim="changePasswordForm.newPassword"
                />
                <span>新密碼</span>
              </label>
              <label class="form-row" :data-warning="errorMessage.confirmNewPassword">
                <input
                  type="password"
                  required
                  v-model.trim="changePasswordForm.confirmNewPassword"
                />
                <span>確認新密碼</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="onChangePassword">
                更新密碼
              </div>
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
  position: relative
  display: flex
  flex-direction: column
  min-height: 100vh
  padding-top: 60px
  padding-bottom: 60px

// bg-wrap
.bg-wrap
  position: fixed
  z-index: -1
  top: 0
  left: 0
  width: 100%
  height: 100vh
  img
    &.bg
      opacity: .6
      +fit
    &.rock
      position: absolute
      z-index: 0
      opacity: .7
    &.rock-01
      width: 100px
      top: 60%
      right: 25%
      animation: rock 6s infinite linear
      +rwdmax(1024)
        top: 70%
        right: 20%
    &.rock-02
      width: 60px
      top: 55%
      left: 15%
      animation: rock 5s infinite 1s linear
    &.rock-03
      width: 55px
      top: 65%
      right: 10%
      animation: rock 6s infinite 2s linear
      +rwdmax(1024)
        right: 8%
    &.rock-04
      width: 20px
      top: 50%
      right: 22%
      animation: rock 7s infinite 1s linear

// login-wrap
.login-wrap
  margin: auto
  width: 100%
  max-width: 400px
  padding: 50px 40px
  border: 1px solid var(--dark-white)
  border-radius: 12px
  background-color: rgba(255, 255, 255, .6)
  backdrop-filter: blur(15px)
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
  .third-party
    display: flex
    justify-content: space-evenly
    align-items: center
    a
      padding: 5px
      &:hover
        outline: 1px solid var(--primary-blue-light)
    img
      width: 50px
  .rect-btn
    margin-top: 20px
    & + .rect-btn
      margin-top: 10px
  .line
    position: relative
    width: 100%
    text-align: center
    margin: 15px 0
    font-family: $code-font
    color: #aaa
    & + .rect-btn
      margin-top: 0
    &::before, &::after
      width: calc(50% - 20px)
      height: 1px
      background-color: #ccc
      top: 50%
      +pseudo
    &::before
      left: 0
    &::after
      right: 0

.forget-password-link
  cursor: pointer

.forget-password-warp
  margin-top: 15px
  text-align: end

.msg
  margin-top: 8px
  font-size: px(14)
  line-height: 1.5
  color: var(--light-gray)
  text-align: center
</style>