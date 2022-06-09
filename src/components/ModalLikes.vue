<script setup>
import { ref, nextTick } from '@vue/runtime-core'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from '../stores/modalStore'
import { getLikeList } from '../api/fetch'
import { cloneDeep } from 'lodash-es'
import Posts from './../components/Posts.vue'


const userStore = useUserStore()
const modalStore = useModalStore()

const { patchUser } = userStore;
const { closeModalLikes } = modalStore

const isLoading = ref(true)

const getLike = async () => {
  await nextTick(async () => {
    isLoading.value = true
    userStore.likes = []
    const { data } = await getLikeList();
    if (data.status !== 'success') return;
    isLoading.value = false
    patchUser(cloneDeep({
      likes: data.data.list
    }))
  })
}

getLike()

</script>

<template>
  <div class="modal-wrapper modal-likes">
    <div class="modal-bg" @click="closeModalLikes"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalLikes"></div>
        <div class="modal-head">
          <span>收藏貼文</span>
        </div>
        <div class="modal-body">
          <div class="is-loading" v-if="isLoading">
            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
              <path opacity="0.2" fill="#ef9c9a" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
              <path opacity="0.6" fill="#ef9c9a" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z">
                <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/>
              </path>
            </svg>
          </div>
          <template v-else-if="userStore.likes?.length">
            <Posts
              v-for="post in userStore.likes"
              :key="post._id"
              :post="post"
            />
          </template>
          <div class="no-post" v-else>
            目前尚未有收藏貼文！
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
  max-width: 760px
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
    max-height: calc(80vh - 61px)
    overflow: auto
    padding: 30px
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
    .is-loading
      padding: 80px 30px

</style>