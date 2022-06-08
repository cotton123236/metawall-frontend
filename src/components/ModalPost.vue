<script setup>
import { onUnmounted, ref } from '@vue/runtime-core'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from './../stores/postStore'
import {
  getPostsByRoute,
  getPostsById,
  patchEditPost,
  postNewPost,
  uploadPostImage
} from './../api/fetch'
// components
// import Image from './../assets/image/login-bg.png'

const route = useRoute()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()

const { closeModalPost, openModalLoader, closeModalLoader, openModalAlert } = modalStore
const { patchPosts, patchProfilePosts, patchPostingData } = postStore
const { postingData } = storeToRefs(postStore)

// 貼文資料處理與發送
const isNewPost = postingData.value.content === ''
const isProfile = route.params.id && route.params.id === userStore._id ? true : false

const submitPost = async () => {
  if (!postingData.value.content) return;
  // 打開 loader
  openModalLoader('發佈中')
  // 發送 request (新增或編輯)
  const { data: submitData } = isNewPost ? await postNewPost(postingData.value) : await patchEditPost(postingData.value)
  // 關閉燈箱
  closeModalLoader()
  closeModalPost()
  // 若成功就重整畫面
  if (submitData.status === 'success') {
    const { data } = isProfile ? await getPostsById(userStore._id) : await getPostsByRoute(route)
    if (data.status !== 'success') return;
    isProfile ? patchProfilePosts(data.data.list) : patchPosts(data.data.list)
  }
  // 若失敗則顯示錯誤訊息
  else {
    openModalAlert(submitData.message)
  }
}

// Rich editor
const editor = useEditor({
  content: postingData.value.content,
  extensions: [
    StarterKit,
    Image
  ],
  onUpdate: ({ editor }) => {
    postingData.value.content = editor.getHTML()
  }
})

// 新增圖片
const imageFile = ref(null)
const addImage = async () => {
  openModalLoader('上傳中')
  const uploadedFile = imageFile.value.files[0];
  console.dir(uploadedFile);
  const formData = new FormData();
  formData.append("file-to-upload", uploadedFile);

  const { data } = await uploadPostImage(formData);

  if (data.status === "success") {
    editor.value.chain().focus().setImage({ src: data.data.upload }).run()
  }
  else {
    openModalAlert(data.message)
  }
  closeModalLoader()
}

onUnmounted(() => {
  patchPostingData({ _id: '', content: '', image: [] })
})

</script>

<template>
  <div class="modal-wrapper modal-post">
    <div class="modal-bg" @click="closeModalPost"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalPost"></div>
        <div class="modal-head">
          <span>{{ isNewPost ? '新增貼文' : '編輯貼文' }}</span>
        </div>
        <div class="modal-body">
          <div class="info">
            <div class="headshot">
              <img v-if="userStore.image" :src="userStore.image" alt="user-photo">
            </div>
            <div class="name">{{ userStore.name }}</div>
          </div>
          <div class="content" v-if="editor">
            <div class="editor-tools">
              <div class="editor-btn" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
                <i class="icon-bold"></i>
              </div>
              <div class="editor-btn" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
                <i class="icon-italic"></i>
              </div>
              <div class="editor-btn" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
                <i class="icon-strike"></i>
              </div>
              <div class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                <i class="icon-title"></i>
              </div>
              <div class="editor-btn" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
                <i class="icon-ul"></i>
              </div>
              <div class="editor-btn" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
                <i class="icon-ol"></i>
              </div>
              <label class="editor-btn">
                <i class="icon-picture"></i>
                <input type="file" @change="addImage" ref="imageFile">
              </label>
            </div>
            <editor-content class="editor-content" :editor="editor" />
            <!-- <div class="picture">
              <img :src="Image" alt="">
            </div> -->
          </div>
        </div>
        <div class="modal-foot">
          <div
            class="rect-btn fill"
            :class="{ disable: !postingData.content || postingData.content === '<p></p>' }"
            @click="submitPost"
          >
            {{ isNewPost ? '發佈貼文' : '編輯貼文' }}
          </div>
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
  border-radius: 10px
  background-color: var(--white)
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
    padding: 20px 40px 0
    +rwdmax(767)
      padding: 20px 20px 0
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
    .content
      padding: 20px 0 0
    // .picture
    //   width: 100%
    //   img
    //     width: 100%
  .modal-foot
    padding: 20px
    +rwdmax(767)
      padding: 10px

// editor
.editor-tools
  display: flex
  .editor-btn
    display: flex
    justify-content: center
    align-items: center
    width: 32px
    height: 32px
    cursor: pointer
    border-radius: 5px
    transition: var(--trans-s)
    & + .editor-btn
      margin-left: 5px
    &:hover
      background-color: var(--background)
    &.is-active
      background-color: var(--dark-gray)
      color: var(--white)
    input[type="file"]
      display: none
.editor-content
  width: 100%
  height: 30vh
  overflow: auto
  padding: 10px
  &::-webkit-scrollbar-track
    border-radius: 10px
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .2)
  &::-webkit-scrollbar
    width: 6px
    +rwdmax(768)
      display: none
  &::-webkit-scrollbar-thumb
    border-radius: 10px
    background-color: #ccc

</style>