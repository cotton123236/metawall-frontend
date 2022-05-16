<script setup>
import 'swiper/css'
import { ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import LogoLarge from './../assets/image/logo-large.svg'


const router = useRouter()

// login mode control
const isLoginMode = ref(true)
const signupSwiperInstance = ref(null)

const changeMode = () => {
  isLoginMode.value = !isLoginMode.value
}

const signupSwiperInit = (swiper) => {
  signupSwiperInstance.value = swiper
}

const slidePrev = () => {
  signupSwiperInstance.value.slidePrev()
}

const slideNext = () => {
  signupSwiperInstance.value.slideNext()
}

const signupSuccess = () => {
  router.push({ path: '/' })
}
</script>

<template>
  <main class="space-lr">
    <div class="login-wrap">
      <div class="inner">
        <div class="logo">
          <img :src="LogoLarge" alt="">
        </div>
        <p class="brief" v-if="isLoginMode">到元宇宙展開你的全新社交圈！</p>
        <p class="brief" v-if="!isLoginMode">註冊加入元宇宙！</p>
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
            <form>
              <label data-warning>
                <input id="email" type="text" required>
                <span>Email</span>
              </label>
              <label>
                <input id="password" type="password" required>
                <span>Password</span>
              </label>
              <div class="rect-btn fill login-btn">登入</div>
              <div class="rect-btn signup-btn" @click="slideNext">註冊</div>
            </form>
          </swiper-slide>
          <!-- sign-up email & password -->
          <swiper-slide>
            <form>
              <label data-warning>
                <input id="email" type="text" required>
                <span>Email</span>
              </label>
              <label>
                <input id="password" type="password" required>
                <span>Password</span>
              </label>
              <label>
                <input id="confirm-password" type="password" required>
                <span>Confirm Password</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="slideNext">註冊</div>
              <div class="rect-btn login-btn" @click="slidePrev">登入</div>
            </form>
          </swiper-slide>
          <!-- sign-up name -->
          <swiper-slide>
            <form>
              <label data-warning>
                <input id="name" type="text" required>
                <span>Name</span>
              </label>
              <div class="rect-btn signup-btn fill" @click="signupSuccess">開啟元宇宙</div>
            </form>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </main>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/mixin

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

  .brief
    font-size: px(14)
    line-height: 1.5
    color: var(--light-gray)
    margin-top: 20px
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