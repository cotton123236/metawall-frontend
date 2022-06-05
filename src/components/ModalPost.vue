<script setup>
import { onUnmounted } from '@vue/runtime-core'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from './../stores/postStore'
import { getPostsByRoute, patchEditPost, postNewPost } from './../api/fetch'
// components
// import RichEditor from './../components/RichEditor.vue'

const route = useRoute()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()

const { closeModalPost, openModalLoader, closeModalLoader, openModalAlert } = modalStore
const { patchPosts, patchPostingData } = postStore
const { postingData } = storeToRefs(postStore)

// 貼文資料處理與發送
const isNewPost = postingData.value.content === ''

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
    const { data } = await getPostsByRoute(route)
    patchPosts(data.data.list)
  }
  // 若失敗則顯示錯誤訊息
  else {
    openModalAlert(submitData.message)
  }
}

const editor = useEditor({
  content: postingData.value.content,
  extensions: [
    StarterKit,
  ],
  onUpdate: ({ editor }) => {
    postingData.value.content = editor.getHTML()
  }
})

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
              <div class="editor-btn">
                <i class="icon-picture"></i>
              </div>
            </div>
            <editor-content class="editor-content" :editor="editor" />
            <!-- <RichEditor class="editor" v-model="postingData.content" /> -->
            <!-- <textarea placeholder="在想些什麼呢？" v-model="postingData.content"></textarea> -->
          </div>
        </div>
        <div class="modal-foot">
          <div
            class="rect-btn fill"
            :class="{ disable: !postingData.content || postingData.content === '<p></p>' }"
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
    .content
      padding: 20px 0
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
.editor-content
  width: 100%
  height: 20vh
  overflow: auto
  padding: 10px

</style>