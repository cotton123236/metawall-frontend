<script setup>
import { inject } from '@vue/runtime-core'
import { computed } from 'vue'
import { useModalStore } from '../stores/modalStore'
import { socketStore } from './../stores/socketStores.js'

const mySocketStore = socketStore();
const modalStore = useModalStore()

const { closeModalChatroomList,openModalCreateChatroomComment } = modalStore

const socket = inject("socket");

const joinRoom = (chatRoom, index) => {
  socket.joinRoom(chatRoom);
  closeModalChatroomList()
};

</script>

<template>
  <div class="modal-wrapper modal-invitation">
    <div class="modal-bg" @click="closeModalChatroomList"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalChatroomList"></div>
        <div class="modal-head tw-flex tw-justify-between">
          <div @click="openModalCreateChatroomComment" class="tw-ml-2 tw-rounded-full hover:tw-bg-slate-200 tw-w-7 tw-h-7 tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
            <i class="icon-plus tw-text-2xl"></i>
          </div>
          <div class="tw-flex tw-items-center">
            <span>聊天室清單</span>
          </div>
          <div class="tw-mr-2 tw-w-7"></div>
        </div>
        <div class="modal-body">
          <ul v-if="mySocketStore.chatroomList.length > 0">
            <li
              v-for="(chatroom, index) in mySocketStore.chatroomList"
              :key="chatroom._id"
              class="info"
            >
              <div class="detail">
                <div class="name">{{ chatroom.displayName }}</div>
              </div>
              <div class="invitation-btn" @click="joinRoom(chatroom, index)">進入聊天室</div>
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