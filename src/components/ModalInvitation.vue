<script setup>
import { inject } from '@vue/runtime-core'
import { computed } from 'vue'
import { useModalStore } from '../stores/modalStore'
import { socketStore } from './../stores/socketStores.js'

const mySocketStore = socketStore();
const modalStore = useModalStore()

const { closeModalInvitation } = modalStore

const socket = inject("socket");

const addUserToRoom = (userId) => {
  socket.addUser(userId, mySocketStore.connectedChatroom._id);
  closeModalInvitation()
}

const invitationList = computed(() => {
  return mySocketStore.userList.filter(user => {
    return !mySocketStore.connectedChatroom.participants.some(chatUser => chatUser._id === user._id)
  })
})

</script>

<template>
  <div class="modal-wrapper modal-invitation">
    <div class="modal-bg" @click="closeModalInvitation"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalInvitation"></div>
        <div class="modal-head">
          <span>邀請名單</span>
        </div>
        <div class="modal-body">
          <ul v-if="invitationList.length > 0">
            <li
              v-for="user in invitationList"
              :key="user._id"
              class="info"
            >
              <router-link
                class="link"
                :to="user._id"
                @click="closeModalInvitation"
              >
                <div class="headshot">
                  <img v-if="user?.avatar" :src="user.avatar" alt="user-photo">
                </div>
                <div class="detail">
                  <div class="name">{{ user?.nickName }}</div>
                </div>
              </router-link>
              <div class="invitation-btn" @click="addUserToRoom(user._id)">邀請</div>
            </li>
          </ul>
          <div class="no-post" v-else>
            目前尚未有邀請名單！
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
    .link
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
      flex: 1
      font-family: $code-font
      .name
        display: inline-block
        font-size: px(16)
        line-height: 1.5
        transition: color var(--trans-s)
        pointer-events: auto
      .date
        font-size: px(12)
        color: #ccc
        line-height: 1.5
        margin-top: 2px
    .invitation-btn
      flex-shrink: 0
      font-size: px(18)
      color: var(--light-gray)
      padding: 5px
      cursor: pointer
      transition: color var(--trans-s)
      margin-left: auto
      &:hover
        color: var(--primary-pink)

</style>