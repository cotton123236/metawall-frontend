<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from './../stores/postStore'
import { deletePost, getPostsByRoute, getPostsById } from './../api/fetch'

const route = useRoute()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()
const { useModalDeletePostId } = storeToRefs(modalStore)
const { openModalLoader, closeModalLoader, openModalAlert, closeModalDeletePost } = modalStore
const { patchPosts, patchProfilePosts } = postStore

// 刪除貼文功能
const isProfile = route.params.id && route.params.id === userStore._id ? true : false

const deletePostHandler = async () => {
  openModalLoader('刪除中')
  const { data } = await deletePost(useModalDeletePostId.value)
  // 刪除成功
  if (data.status === 'success') {
    const { data } = isProfile ? await getPostsById(userStore._id) : await getPostsByRoute(route)
    if (data.status !== 'success') return;
    isProfile ? patchProfilePosts(data.data.list) : patchPosts(data.data.list)
  }
  // 錯誤
  else {
    openModalAlert(data.message)
  }
  closeModalDeletePost()
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