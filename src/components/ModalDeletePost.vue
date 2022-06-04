<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from './../stores/postStore'
import { deletePost, getPostsByRoute } from './../api/fetch'

const route = useRoute()
const modalStore = useModalStore()
const postStore = usePostStore()
const { useModalDeletePostId } = storeToRefs(modalStore)
const { openModalLoader, closeModalLoader, openModalAlert, closeModalDeletePost } = modalStore
const { patchPosts } = postStore

const deletePostHandler = async () => {
  openModalLoader('刪除中')
  const { data } = await deletePost(useModalDeletePostId.value)
  closeModalDeletePost()
  // 刪除成功
  if (data.status === 'success') {
    const { data } = await getPostsByRoute(route)
    patchPosts(data.data.list)
  }
  // 錯誤
  else {
    openModalAlert(data.message)
  }
  closeModalLoader()
}

</script>

<template>
  <div class="modal-wrapper modal-delete-post">
    <div class="modal-bg" @click="closeModalDeletePost"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalDeletePost"></div>
        <div class="modal-body">
          <p>確定刪除此貼文？</p>
          <div class="rect-btn" @click="deletePostHandler">
            <span>確定</span>
          </div>
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
  max-width: 440px
  border-radius: 10px
  background-color: #fff
  margin: auto
  pointer-events: auto
  .close-btn
    position: absolute
    z-index: 2
    top: 17px
    right: 20px
  .modal-body
    padding: 80px 20px 20px
    text-align: center
    p
      font-size: px(14)
      line-height: 1.5
      color: var(--gray)
      & + .rect-btn
        margin-top: 40px

</style>