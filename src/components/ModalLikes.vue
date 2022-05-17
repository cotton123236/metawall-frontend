<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from './../stores/stores'
import { useUserStore } from './../stores/userStore'

import Posts from './../components/Posts.vue'


const store = useStore()
const userStore = useUserStore()

const { changeModalLikesState } = store

</script>

<template>
  <div class="modal-wrapper modal-likes">
    <div class="modal-bg" @click="changeModalLikesState"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="changeModalLikesState"></div>
        <div class="modal-head">
          <span>收藏貼文</span>
        </div>
        <div class="modal-body">
          <Posts
            v-for="post in userStore.likes"
            :key="post._id"
            :post="post"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/mixin

// modal-post
.modal-content
  pointer-events: none
.modal
  position: relative
  width: 90%
  max-width: 800px
  // border-radius: 8px
  background-color: #fff
  margin: auto
  pointer-events: auto
  .close-btn
    position: absolute
    z-index: 2
    top: 17px
    right: 20px
  .modal-head
    position: relative
    font-size: px(14)
    line-height: 1.5
    padding: 20px
    text-align: center
    +rwdmax(767)
      padding: 20px 10px
    &::after
      position: absolute
      content: ''
      display: block
      width: calc(100% - 40px)
      height: 1px
      left: 20px
      bottom: 0
      background-color: var(--dark-white)
      +rwdmax(767)
        width: calc(100% - 20px)
        left: 10px
  .modal-body
    max-height: calc(80vh - 61px)
    overflow: auto
    padding: 20px

</style>