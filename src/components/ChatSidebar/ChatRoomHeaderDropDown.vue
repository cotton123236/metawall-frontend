<script setup>
import { ref } from 'vue-demi';
import { useModalStore } from "../../stores/modalStore";

const modalStore = useModalStore();

const {
  openModalCreateChatroomComment
} = modalStore
</script>
<template>
  <div class="more">
    <div class="more-btn" @click="openModalCreateChatroomComment">
      <i class="icon-plus"></i>
    </div>
  </div>
</template>
<style lang="sass" scoped>
  .more
    position: relative
    &:hover
      .more-list
        z-index: 20
        opacity: 1
        pointer-events: auto
        transform: translate(-50%, 0)
    .more-btn
      display: flex
      justify-content: center
      align-items: center
      width: 30px
      height: 30px
      border-radius: 50%
      cursor: pointer
      transition: background-color var(--trans-s)
      &:hover
        background-color: var(--dark-white)
      i
        font-size: 20px
    ul
      background-color: var(--white)
      overflow: hidden
      border-radius: 5px
      padding: 5px 0
      &::before
        position: absolute
        content: ''
        top: -8px
        left: 50%
        transform: translateX(-50%)
        border-width: 0 8px 8px 8px
        border-style: solid
        border-color: transparent transparent #fff transparent
      a
        display: block
        font-size: px(12)
        line-height: 1.5
        text-align: center
        padding: 5px 10px
        &:hover
          color: var(--primary-blue)
</style>