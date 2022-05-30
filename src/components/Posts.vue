<script setup>
import { onMounted, ref } from '@vue/runtime-core'
import { useDateFormat } from './../utils/utils'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from '../stores/modalStore'
import { usePostStore } from '../stores/postStore'
import Comment from './Comment.vue'

const props = defineProps({
  post: Object
})

const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()
const { patchPostingData } = postStore
const { openModalPost } = modalStore

// 編輯貼文按鈕
const editPostHandler = (post) => {
  const { _id, content, image } = post
  patchPostingData({ _id, content, image })
  openModalPost()
}

// 子元件操控
const isCommentOpen = ref(false)
const isMoreOpen = ref(false)

const changeMoreOpenStatus = () => {
  isMoreOpen.value = !isMoreOpen.value
}

onMounted(() => {
  document.body.addEventListener('click', () => {
    isMoreOpen.value = false
  })
})
</script>

<template>
  <div class="each-post">
    <!-- info -->
    <div class="info">
      <router-link class="headshot" :to="post.editor._id">
        <img v-if="post.editor.avatar" :src="post.editor.avatar" alt="user-photo">
      </router-link>
      <!-- detail -->
      <div class="detail">
        <router-link class="name" :to="post.editor._id">{{ post.editor.nickName }}</router-link>
        <div class="date">{{ useDateFormat(post.createdAt) }}</div>
      </div>
      <!-- more -->
      <div class="more"
        :class="{ active: isMoreOpen }"
        @click.stop="changeMoreOpenStatus"
      >
        <div class="more-btn">
          <i class="icon-more"></i>
        </div>
        <div class="more-list">
          <ul>
            <li @click.stop="changeMoreOpenStatus">
              <router-link :to="post.editor._id">個人檔案</router-link>
            </li>
            <li
              v-if="userStore._id === post.editor._id"
              @click.stop="changeMoreOpenStatus"
            >
              <a href="javascript:;" @click="editPostHandler(post)">編輯貼文</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- text -->
    <div class="text">
      <div class="ProseMirror" v-html="post.content"></div>
    </div>
    <!-- tool -->
    <div class="tool">
      <div class="like">
        <i class="icon-like"></i>
        <span class="num" v-if="post.likes.length">{{ post.likes.length }}</span>
      </div>
      <div class="commit" @click="isCommentOpen = true">
        <i class="icon-commit"></i>
        <!-- <span class="num"></span> -->
      </div>
      <!-- <div class="share">
        <i class="icon-share"></i>
      </div> -->
    </div>
    <!-- comments -->
    <div class="comments" v-if="isCommentOpen">
      <div class="self-comment">
        <div class="headshot">
          <!-- <img src="" alt=""> -->
        </div>
        <div class="content">
          <span class="name">Wilson</span>
          <p contenteditable="true"></p>
          <!-- <textarea></textarea> -->
        </div>
      </div>
      <div class="comments-list">
        <Comment />
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

// each-post
.each-post
  border: 1px solid var(--dark-white)
  border-radius: 8px
  background-color: #fff
  box-shadow: 0 0 5px rgba(0, 0, 0, .1)
  &:not(:first-child)
    margin-top: 20px
  .info
    position: relative
    display: flex
    align-items: center
    padding: 20px 30px 0
  .headshot
    width: 50px
    height: 50px
    margin-right: 15px
  .detail
    flex: 1
    font-family: $code-font
    .name
      font-size: px(16)
      line-height: 1.5
    .date
      font-size: px(12)
      color: #ccc
      line-height: 1.5
      margin-top: 2px
  .more
    position: relative
    &.active
      .more-list
        z-index: 2
        opacity: 1
        pointer-events: auto
        transform: translate(-50%, 0)
    .more-btn
      display: flex
      justify-content: center
      align-items: center
      width: 30px
      height: 30px
      border-radius: 50%
      cursor: pointer
      transition: background-color var(--trans-s)
      &:hover
        background-color: var(--dark-white)
      i
        font-size: 20px
    .more-list
      position: absolute
      top: calc(100% + 10px)
      left: 50%
      transform: translate(-50%, -10px)
      width: 90px
      filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.2))
      opacity: 0
      pointer-events: none
      transition: var(--trans-s)
    ul
      background-color: var(--white)
      overflow: hidden
      border-radius: 5px
      &::before
        position: absolute
        content: ''
        top: -8px
        left: 50%
        transform: translateX(-50%)
        border-width: 0 8px 8px 8px
        border-style: solid
        border-color: transparent transparent #fff transparent
      a
        display: block
        font-size: px(12)
        line-height: 1.5
        text-align: center
        padding: 8px 10px
        &:hover
          color: var(--primary-blue)
  .text
    padding: 30px
  .tool
    position: relative
    display: flex
    // padding: 0 20px
    &::after
      position: absolute
      left: 20px
      width: calc(100% - 40px)
      height: 1px
      top: 0
      display: block
      content: ''
      background-color: var(--dark-white)
    > div
      width: 100%
      display: flex
      justify-content: center
      align-items: center
      color: var(--light-gray)
      padding: 15px
      cursor: pointer
      transition: color var(--trans-s)
      &:hover
        color: var(--dark-gray)
    i
      font-size: 18px
    .num
      font-size: px(13)
      margin-left: 10px
  .comments
    position: relative
    padding: 20px 30px
    &::after
      position: absolute
      left: 20px
      width: calc(100% - 40px)
      height: 1px
      top: 0
      display: block
      content: ''
      background-color: var(--dark-white)
    .self-comment
      display: flex
      align-items: flex-start
      .headshot
        width: 40px
        height: 40px
      .content
        width: 100%
        .name
          font-family: $code-font
          font-size: px(14)
          line-height: 1.5
        p
          font-size: px(14)
          line-height: 1.5
          color: var(--gray)
          margin-top: 3px
          width: 100%
          background-color: var(--background)
          border: none
          resize: none
          border-radius: 20px
          padding: 5px 20px
    .comments-list
      margin-top: 20px
    .each-comment
      & + .each-comment
        margin-top: 15px
</style>