<script setup>
import { ref } from '@vue/runtime-core'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from '../stores/modalStore'
import { useDateFormat } from './../utils/utils'
import { getFollowList, deleteFollowByperson } from '../api/fetch'
// components
import Loader from './../components/Loader.vue'

const userStore = useUserStore()
const modalStore = useModalStore()

const { closeModalFollows } = modalStore
const { patchUser } = userStore;

const isLoading = ref(true)

// 取得追蹤列表
const getFollow = async () => {
  isLoading.value = true
  const { data } =  await getFollowList(userStore._id);
  if (data.status !== 'success') return;
  isLoading.value = false
  patchUser({
    follows: data.data.list
  })
}

// 取消追蹤
const deleteFollow = async (id) => {
  const { data } = await deleteFollowByperson(id);
  if (data.status !== 'success') return;
  getFollow()
}

getFollow()

</script>

<template>
  <div class="modal-wrapper modal-follows">
    <div class="modal-bg" @click="closeModalFollows"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalFollows"></div>
        <div class="modal-head">
          <span>追蹤名單</span>
        </div>
        <div class="modal-body">
          <div class="is-loading" v-if="isLoading">
            <Loader />
          </div>
          <ul v-else-if="userStore.follows?.length">
            <li
              v-for="follow in userStore.follows"
              :key="follow._id"
            >
              <template v-if="follow?.following">
                <div class="info" v-for="following in follow.following" :key="following._id">
                  <div class="headshot">
                    <img v-if="following.avatar" :src="following.avatar" alt="user-photo">
                  </div>
                  <div class="detail">
                    <div class="name">{{ following?.nickName }}</div>
                    <div class="date">追蹤於 - {{ useDateFormat(follow.createdAt) }}</div>
                  </div>
                  <div class="unfollow-btn" @click="deleteFollow(following._id)">取消追蹤</div>
                </div>
              </template>              
            </li>
          </ul>
          <div class="no-post" v-else>
            目前尚未有追蹤名單！
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
  max-width: 500px
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
    ul
      padding: 20px
    .info
      position: relative
      display: flex
      align-items: center
      padding: 10px 20px
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
    .unfollow-btn
      font-size: px(12)
      color: var(--light-gray)
      padding: 5px
      cursor: pointer
      transition: color var(--trans-s)
      &:hover
        color: var(--gray)

</style>