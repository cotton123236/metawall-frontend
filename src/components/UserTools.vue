<script setup>
import { ref, onMounted } from '@vue/runtime-core'
import { useUserStore } from './../stores/userStore'


const userStore = useUserStore()

// open and close control
const userToolsActive = ref(false)

const activeControl = () => {
  userToolsActive.value = !userToolsActive.value
}

onMounted(() => {
  document.body.addEventListener('click', (e) => {
    if (!e.target.classList.contains('user-tools') && !e.target.closest('.user-tools')) {
      userToolsActive.value = false
    }
  })
})
</script>

<template>
  <div class="user-tools" :class="{ active: userToolsActive }" @click="activeControl">
    <div class="user-photo">
      <img :src="userStore.image" alt="user-photo">
    </div>
    <div class="user-dropdown">
      <ul>
        <li>
          <router-link :to="userStore._id">查看個人檔案</router-link>
        </li>
        <li>
          <router-link to="/settings">設定與資料</router-link>
        </li>
        <li>
          <router-link to="/login">登出</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="sass">
@import ./../assets/sass/base/mixin

.user-tools
  position: relative
  &.active
    .user-dropdown
      opacity: 1
      transform: translate(-50%, 0)
      pointer-events: auto

  .user-photo
    width: 30px
    height: 30px
    border-radius: 50%
    overflow: hidden
    cursor: pointer
    img
      +fit
    
  .user-dropdown
    position: absolute
    z-index: 2
    top: calc(100% + 15px)
    left: 50%
    width: 150px
    opacity: 0
    transform: translate(-50%, -20px)
    pointer-events: none
    transition: opacity var(--trans-m), transform var(--trans-m), box-shadow var(--trans-m)
    filter: drop-shadow(5px 5px 8px rgba(0, 0, 0, .2))
    &::before
      position: absolute
      content: ''
      top: -10px
      left: 50%
      transform: translateX(-50%)
      border-width: 0 10px 10px 10px
      border-style: solid
      border-color: transparent transparent #fff transparent
    ul
      padding: 5px 0
      border-top: none
      border-radius: 10px
      background-color: #fff
      overflow: hidden
    li
      &.active
        background-color: var(--dark-white)
      a
        font-size: px(14)
        font-weight: 300
        letter-spacing: .02em
        color: var(--dark-gray)
        display: block
        padding: 12px 20px
        transition: background-color var(--trans-m)
        &:hover
          background-color: var(--dark-white)
</style>