<script setup>
import { inject, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from './../stores/postStore'
import { getPostByRoute, postPostByData } from './../api/fetch'


const route = useRoute()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()

const { closeModalPost, openModalLoader, closeModalLoader } = modalStore
const { patchPosts } = postStore

// post data handler
const postContent = ref('')

const postNewPost = async () => {
  if (!postContent.value) return;
  openModalLoader()
  const postData = {
    content: postContent.value,
    user: userStore._id
  }
  try {
    await postPostByData(postData)
    closeModalLoader()
    closeModalPost()
    const { data } = await getPostByRoute(route)
    patchPosts(data)
  }
  catch(err) {
    console.log(err)
  }
}

</script>

<template>
  <div class="modal-wrapper modal-post">
    <div class="modal-bg" @click="closeModalPost"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalPost"></div>
        <div class="modal-head">
          <span>新增貼文</span>
        </div>
        <div class="modal-body">
          <div class="info">
            <div class="headshot">
              <img :src="userStore.image" alt="user-photo">
            </div>
            <div class="name">{{ userStore.name }}</div>
          </div>
          <div class="content">
            <textarea placeholder="在想些什麼呢？" v-model="postContent"></textarea>
          </div>
        </div>
        <div class="modal-foot">
          <div
            class="rect-btn fill"
            :class="{ disable: !postContent }"
            @click="postNewPost"
          >發布貼文</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

// modal-post
.modal-content
  pointer-events: none
.modal
  position: relative
  width: 90%
  max-width: 600px
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
    padding: 20px 40px
    +rwdmax(767)
      padding: 20px 20px
    .info
      display: flex
      align-items: center
    .headshot
      width: 50px
      height: 50px
      margin-right: 15px
      img
        +fit
    .name
      font-family: $code-font
      line-height: 1.5
    textarea
      resize: none
      width: 100%
      min-height: 18vh
      font-family: $basic-font
      font-size: px(14)
      line-height: 1.5
      letter-spacing: .02em
      font-weight: 300
      color: var(--gray)
      border: none
      padding: 20px 0
  .modal-foot
    padding: 20px
    +rwdmax(767)
      padding: 10px
  
</style>