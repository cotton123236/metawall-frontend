<script setup>
import { reactive, watch } from "@vue/runtime-core";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const userData = reactive({
  name: "Wilson",
  gender: 2,
  old_password: "",
  password: "12345678",
  confirmPassword: "12345678",
});
</script>

<template>
  <section>
    <div class="headshot-wrap">
      <label class="headshot">
        <input type="file" />
        <img v-if="userStore.image" :src="userStore.image" alt="" />
      </label>
      <i class="icon-plus"></i>
    </div>
    <div class="content">
      <div class="inner">
        <h2>編輯個人資料</h2>
        <form>
          <!-- 使用者名稱 -->
          <label class="form-row" data-warning>
            <input id="name" type="text" required v-model="userData.name" />
            <span>使用者名稱</span>
          </label>
          <!-- 使用者性別 -->
          <div class="form-row form-radio">
            <p>使用者性別</p>
            <label for="male">
              <input
                name="gender"
                id="male"
                value="0"
                type="radio"
                v-model="userData.gender"
              />
              <div class="fake-radio"></div>
              <span>男性</span>
            </label>
            <label for="female">
              <input
                name="gender"
                id="female"
                value="1"
                type="radio"
                v-model="userData.gender"
              />
              <div class="fake-radio"></div>
              <span>女性</span>
            </label>
            <label for="unknown">
              <input
                name="gender"
                id="unknown"
                value="2"
                type="radio"
                v-model="userData.gender"
              />
              <div class="fake-radio"></div>
              <span>未知宇宙生物</span>
            </label>
          </div>
        </form>
        <h2>重新設定密碼</h2>
        <form>
          <!-- 使用者密碼 -->
          <label class="form-row" data-warning>
            <input
              id="password"
              type="password"
              required
              v-model="userData.old_password"
            />
            <span>原密碼</span>
          </label>
          <label class="form-row" data-warning>
            <input
              id="password"
              type="password"
              required
              v-model="userData.password"
            />
            <span>使用者密碼</span>
          </label>
          <!-- 確認使用者密碼 -->
          <label class="form-row" data-warning>
            <input
              id="confirm-password"
              type="password"
              required
              v-model="userData.confirmPassword"
            />
            <span>確認使用者密碼</span>
          </label>
          <div class="rect-btn fill login-btn" @click="changePassword">
            保存
          </div>
        </form>
        <div class="rect-btn fill submit-btn">修改個人資料</div>
      </div>
    </div>
  </section>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/mixin

section
  padding-bottom: 40px

.headshot-wrap
  position: relative
  z-index: 2
  width: 140px
  height: 140px
  margin: 0 auto -70px
  border-radius: 50%
  border: 10px solid var(--background)
  background-color: var(--background)
  +rwdmax(767)
    width: 120px
    height: 120px
    margin: 0 auto -60px
  .headshot
    position: relative
    box-shadow: 0 0 10px rgba(0, 0, 0, .3)
    width: 100%
    height: 100%
    cursor: pointer
    &:hover
      & + i
        opacity: .9
      &::before
        opacity: 1
    &::before
      background-color: rgba(0, 0, 0, .3)
      opacity: 0
      transition: opacity var(--trans-s)
      +posFill
      +pseudo
    input
      display: none
  i
    display: flex
    justify-content: center
    align-items: center
    position: absolute
    bottom: 7px
    right: 7px
    width: 20px
    height: 20px
    border-radius: 50%
    color: var(--white)
    background-color: var(--primary-pink)
    opacity: 0
    transition: opacity var(--trans-s)

.content
  position: relative
  z-index: 1
  padding: 100px 40px
  background-color: var(--white)
  border-radius: 20px
  box-shadow: 0 0 10px rgba(0, 0, 0, .1)
  +rwdmax(767)
    padding: 100px 30px
  .inner
    max-width: 500px
    margin: auto
  h2
    font-size: px(16)
    line-height: 1.5
    font-weight: 500
    text-align: center
    & + form
      margin-top: 40px
  form
    & + h2
      margin-top: 100px
      +rwdmax(767)
        margin-top: 60px
    .form-row
      & + .form-row
        margin-top: 40px
      & + .form-radio
        margin-top: 30px
      input[type="text"], input[type="password"]
        background-color: transparent
        border: none
        border-bottom: 1px solid var(--dark-white)
        border-radius: 0
        font-size: px(16)
        padding: 10px 5px
        &:focus, &:valid
          box-shadow: none
        &:focus + span, &:valid + span
          color: var(--primary-blue)
          transform: translate(2px, -30px) scale(.8)
        & + span
          left: 0
      > label
        display: flex
        align-items: center
  .submit-btn
    margin: 80px auto 0
    +rwdmax(767)
      margin: 60px auto 0
</style>