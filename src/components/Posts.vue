<script setup>
import { watch } from "vue";
import { onMounted, ref } from '@vue/runtime-core'
import { useDateFormat } from './../utils/utils'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from './../stores/postStore'
import { putLike, delPostLike, postComment } from './../api/fetch'
// components
import contenteditable from 'vue-contenteditable'
import Comment from './Comment.vue'

const props = defineProps({
  post: Object
})

const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()
const { patchPostComment, patchPostingData } = postStore
const { openModalPost, openModalDeletePost } = modalStore

// 編輯貼文
const editPostHandler = (post) => {
  const { _id, content, image } = post
  patchPostingData({ _id, content, image })
  openModalPost()
}

// 刪除貼文
const deletePostHandler = async (post) => {
  const { _id } = post
  openModalDeletePost(_id)
}

// 新增留言
const addComment = async () => {
  if (!commentValue.value || commentValue.value.trim().length === 0) return
  const { data } = await postComment(props.post._id, commentValue.value);
  if (data.status !== 'success') return
  patchPostComment(props.post._id, data.data.comment)
  commentValue.value = ''  
}

// 子元件操控
const isMoreOpen = ref(false)
const isLike = ref(false)
const isCommentOpen = ref(false)
const commentValue = ref('')

const changeMoreOpenStatus = () => {
  isMoreOpen.value = !isMoreOpen.value
}

// 載入時確認自己有沒有按讚
const checkIsLike = () => {
  props.post.likes.findIndex(item => item._id === userStore._id || item === userStore._id) >= 0
    ? isLike.value = true
    : isLike.value = false
}
checkIsLike()

// 避免 async 問題，監聽
watch(()=> userStore._id, (newVal)=>{
  checkIsLike()
},{deep:true})

watch(()=> postStore.posts, (newVal)=>{
  checkIsLike()
},{deep:true})

// 點擊按讚 button
const triggerLikeBtn = async() => {
  try{
    isLike.value = !isLike.value
    if(isLike.value){
      const { target: putLikeResult } = await putLike(props.post._id)
      props.post.likes = putLikeResult.likes
    }else{
      const { target: delLikeResult } = await delPostLike(props.post._id)
      props.post.likes = delLikeResult.likes
    }
  }catch(err){
    console.log(err)
  }
}

onMounted(() => {
  document.body.addEventListener('click', () => {
    isMoreOpen.value = false
  })
})
</script>

<template>
  <div class="each-post" data-aos="clip-left">
    <!-- info -->
    <div class="info">
      <router-link class="wrap" :to="post.editor._id">
        <div class="headshot">
          <img v-if="post.editor.avatar" :src="post.editor.avatar" alt="user-photo">
        </div>
        <!-- detail -->
        <div class="detail">
          <div class="name">{{ post.editor.nickName }}</div>
          <div class="date">{{ useDateFormat(post.createdAt) }}</div>
        </div>
      </router-link>
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
            <li
              v-if="userStore._id === post.editor._id"
              @click.stop="changeMoreOpenStatus"
            >
              <a href="javascript:;" @click="deletePostHandler(post)">刪除貼文</a>
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
      <!-- like-btn -->
      <div class="like like-btn" :class="{active: isLike}" @click="triggerLikeBtn">
        <div class="icon">
          <i class="icon-like"></i>
          <i class="icon-heart"></i>
          <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
            <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 389)">
              <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>
              <g id="grp7" opacity="0" transform="translate(7 6)">
                <circle id="oval1" fill="#ff9595" cx="2" cy="6" r="2"/>
                <circle id="oval2" fill="#ff9595" cx="5" cy="2" r="2"/>
              </g>
              <g id="grp6" opacity="0" transform="translate(0 28)">
                <circle id="oval1" fill="#ff9595" cx="2" cy="7" r="2"/>
                <circle id="oval2" fill="#ff9595" cx="3" cy="2" r="2"/>
              </g>
              <g id="grp3" opacity="0" transform="translate(52 28)">
                <circle id="oval2" fill="#ff9595" cx="2" cy="7" r="2"/>
                <circle id="oval1" fill="#ff9595" cx="4" cy="2" r="2"/>
              </g>
              <g id="grp2" opacity="0" transform="translate(44 6)">
                <circle id="oval2" fill="#ff9595" cx="5" cy="6" r="2"/>
                <circle id="oval1" fill="#ff9595" cx="2" cy="2" r="2"/>
              </g>
              <g id="grp5" opacity="0" transform="translate(14 50)">
                <circle id="oval1" fill="#ff9595" cx="6" cy="5" r="2"/>
                <circle id="oval2" fill="#ff9595" cx="2" cy="2" r="2"/>
              </g>
              <g id="grp4" opacity="0" transform="translate(35 50)">
                <circle id="oval1" fill="#ff9595" cx="6" cy="5" r="2"/>
                <circle id="oval2" fill="#ff9595" cx="2" cy="2" r="2"/>
              </g>
              <g id="grp1" opacity="0" transform="translate(24)">
                <circle id="oval1" fill="#ff9595" cx="2.5" cy="3" r="2"/>
                <circle id="oval2" fill="#ff9595" cx="7.5" cy="2" r="2"/>
              </g>
            </g>
          </svg>
        </div>
        <span class="num" v-if="post.likes">{{ post.likes.length }}</span>
      </div>
      <!-- comment-btn -->
      <div class="comment comment-btn" @click="isCommentOpen = true">
        <i class="icon-commit"></i>
        <span class="num" v-if="post.comments">{{ post.comments.length }}</span>
      </div>
      <!-- <div class="share">
        <i class="icon-share"></i>
      </div> -->
    </div>
    <!-- comments -->
    <div class="comments" v-if="isCommentOpen">
      <!-- 留言輸入 -->
      <div class="self-comment">
        <div class="headshot">
          <img v-if="userStore.image" :src="userStore.image" alt="user-photo">
        </div>
        <div class="content">
          <span class="name">{{ userStore.name }}</span>
          <div class="textarea">
            <contenteditable tag="p" :contenteditable="true" v-model="commentValue" />
            <!-- <p contenteditable="true">{{ commentValue }}</p> -->
            <div class="submit-btn" @click="addComment" :class="{disable: !commentValue}">發佈</div>
          </div>
        </div>
      </div>
      <!-- 其他留言 -->
      <div class="comments-list">
        <template v-if="post.comments.length">
          <Comment 
            v-for="comment in post.comments"
            :key="comment._id"
            :comment="comment"
          />
        </template>
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
  border-radius: 10px
  background-color: var(--white)
  box-shadow: 0 0 5px rgba(0, 0, 0, .1)
  &:not(:first-child)
    margin-top: 20px
    +rwdmax(767)
      margin-top: 15px
  // info
  .info
    position: relative
    display: flex
    align-items: center
    padding: 20px 30px 0
    +rwdmax(767)
      padding: 20px 20px 0
  .wrap
    flex: 1
    display: flex
    align-items: center
    pointer-events: none
    &:hover
      img
        transform: scale(1.1)
      .name
        color: var(--primary-pink)
  .headshot
    width: 50px
    height: 50px
    margin-right: 15px
    pointer-events: auto
    img
      transition: transform var(--trans-m)
  .detail
    font-family: $code-font
    .name
      font-size: px(16)
      line-height: 1.5
      pointer-events: auto
      transition: var(--trans-s)
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
      padding: 5px 0
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
        padding: 5px 10px
        &:hover
          color: var(--primary-blue)
  // text
  .text
    padding: 30px
    +rwdmax(767)
      padding: 25px 20px
  // tool
  .tool
    position: relative
    display: flex
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
    .icon
      position: relative
    i
      display: inline-block
      font-size: 18px
    .num
      font-size: px(13)
      margin-left: 10px
  .comments
    position: relative
    padding: 20px 30px
    +rwdmax(767)
      padding: 20px
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
        flex-shrink: 0
        width: 40px
        height: 40px
      .content
        width: 100%
        .name
          font-family: $code-font
          font-size: px(14)
          line-height: 1.5
        .textarea
          position: relative
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
            padding: 5px 40px 5px 20px
          .submit-btn
            position: absolute
            bottom: 4px
            right: 15px
            font-size: px(12)
            padding: 5px
            cursor: pointer
            color: var(--primary-blue-light)
            opacity: .7
            transition: opacity var(--trans-s)
            &:hover
              opacity: 1
            &.disable
              opacity: .2
    .comments-list
      margin-top: 20px
    .each-comment
      & + .each-comment
        margin-top: 15px
</style>