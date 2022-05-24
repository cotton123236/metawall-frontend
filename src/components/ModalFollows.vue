<script setup>
import { useUserStore } from './../stores/userStore'
import { useModalStore } from '../stores/modalStore'
import { useDateFormat } from './../utils/utils'


const userStore = useUserStore()
const modalStore = useModalStore()

const { closeModalFollows } = modalStore

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
          <ul>
            <li
              v-for="follow in userStore.follows"
              :key="follow._id"
            >
              <div class="info">
                <div class="headshot">
                  <img :src="follow.image" alt="user-photo">
                </div>
                <div class="detail">
                  <div class="name">{{ follow.name }}</div>
                  <div class="date">追蹤於 - {{ useDateFormat('2022-05-10T09:23:26.413Z') }}</div>
                </div>
                <div class="unfollow-btn">取消追蹤</div>
              </div>
            </li>
          </ul>
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
    max-height: calc(80vh - 61px)
    overflow: auto
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
      img
        +fit
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
      font-size: px(14)
      color: var(--light-gray)
      padding: 5px
      cursor: pointer
      transition: color var(--trans-s)
      &:hover
        color: var(--gray)

</style>