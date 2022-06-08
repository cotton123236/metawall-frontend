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
let errorMessage = ref('');

const getLike = async () => {
  await nextTick(async ()=>{
    userStore.likes = []
    const { data } = await getLikeList();
    if (data.status !== 'success') return
    if(data.data.list.length === 0) {
      errorMessage.value =  '無收藏貼文'
      return
    }
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
          <template v-if="userStore.likes?.length">
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
  max-width: 800px
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

</style>