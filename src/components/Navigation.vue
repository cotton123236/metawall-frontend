<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from './../stores/stores'


const store = useStore()

const { user } = storeToRefs(store)
const { changeModalPostState, changeModalFollowsState, changeModalLikesState } = store

</script>

<template>
  <nav>
    <div class="user-wrap">
      <div class="user-photo">
        <img :src="user.image" alt="user-photo">
      </div>
      <div class="user-name">{{ user.name }}</div>
    </div>
    <ul class="user-tools">
      <li @click="changeModalPostState">
        <i class="icon-add-square"></i>
        <span>新增貼文</span>
      </li>
      <li @click="changeModalFollowsState">
        <i class="icon-bell"></i>
        <span>追蹤名單</span>
      </li>
      <li @click="changeModalLikesState">
        <i class="icon-like"></i>
        <span>收藏文章</span>
      </li>
    </ul>
  </nav>
</template>

<style lang="sass">
@import ./../assets/sass/mixin

// nav
nav
  position: sticky
  top: 85px
  right: 0
  +rwdmax(900)
    position: fixed
    z-index: 9
    top: auto
    bottom: 0
    width: 100%
    display: flex
    background-color: #fff
    border-top-left-radius: 30px
    border-top-right-radius: 30px
    box-shadow: 0 0 15px rgba(0, 0, 0, .1)

  .user-wrap
    display: flex
    align-items: center
    padding: 12px
    background-color: #fff
    border-radius: 40px
    border: 1px solid var(--dark-white)
    box-shadow: 0 0 5px rgba(0, 0, 0, .1)
    +rwdmax(900)
      background-color: transparent
      box-shadow: none
      border: none
  .user-photo
    width: 50px
    height: 50px
    border-radius: 50%
    overflow: hidden
    margin-right: 15px
    img
      +fit
  .user-name
    font-family: $code-font
    font-size: px(18)
    line-height: 1.5
    color: var(--gray)
    +rwdmax(900)
      display: none

  .user-tools
    border-radius: 20px
    // background-color: #fff
    // border: 1px solid var(--dark-white)
    // box-shadow: 0 0 5px rgba(0, 0, 0, .1)
    // padding: 12px
    margin-top: 20px
    +rwdmax(900)
      display: flex
      align-items: center
      margin-top: 0
    li
      display: flex
      align-items: center
      color: var(--dark-gray)
      border-radius: 25px
      padding: 15px 20px
      transition: var(--trans-m)
      border: 1px solid transparent
      cursor: pointer
      // border-radius: 4px
      &:hover
        // background-color: #fff
        // box-shadow: 0 0 5px rgba(0, 0, 0, .1)
        // border: 1px solid var(--dark-white)
      &.disable
        pointer-events: none
        opacity: .2
      i
        // display: flex
        // justify-content: center
        // align-items: center
        // width: 50px
        font-size: px(20)
        margin-right: 25px
      span
        font-size: px(14)
</style>