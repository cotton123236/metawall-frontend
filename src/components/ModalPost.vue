<script setup>
// import { onUnmounted, reactive, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from './../stores/postStore'
import { getPostsByRoute, patchEditPost, postNewPost } from './../api/fetch'
// components
import RichEditor from './../components/RichEditor.vue'


const route = useRoute()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()

const { closeModalPost, openModalLoader, closeModalLoader } = modalStore
const { patchPosts, patchPostingData } = postStore
const { postingData } = storeToRefs(postStore)

// 貼文資料處理與發送
const isNewPost = postingData.value.content === ''

const submitPost = async () => {
  if (!postingData.value.content) return;
  // 打開 loader
  openModalLoader()
  // 發送 request (新增或編輯)
  const { data: submitData } = isNewPost ? await postNewPost(postingData.value) : await patchEditPost(postingData.value)
  // 關閉燈箱
  closeModalLoader()
  closeModalPost()
  // 若成功就重整畫面
  if (submitData.status === 'success') {
    const { data } = await getPostsByRoute(route)
    patchPosts(data.data.list)
  }
  // 清空 postStore 資料
  patchPostingData({ _id: '', content: '', image: [] })
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
              <img v-if="userStore.image" :src="userStore.image" alt="user-photo">
            </div>
            <div class="name">{{ userStore.name }}</div>
          </div>
          <div class="content">
            <RichEditor class="editor" v-model="postingData.content" />
            <!-- <textarea placeholder="在想些什麼呢？" v-model="postingData.content"></textarea> -->
          </div>
        </div>
        <div class="modal-foot">
          <div
            class="rect-btn fill"
            :class="{ disable: !postingData.content }"
            @click="submitPost"
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
    .name
      font-family: $code-font
      line-height: 1.5
    .editor
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