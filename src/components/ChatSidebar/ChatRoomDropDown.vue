<script setup>
import { inject } from "vue";
const socket = inject("socket");
const props = defineProps({
  chatroom: Object,
})
</script>
<template>
  <div class="more">
        <div class="more-btn" @click="socket.leaveChatroom(chatroom._id)">
          <i class="icon-cancel"></i>
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
        transform: translate(-50%, 0)
        pointer-events: auto
      
  .more-btn
    display: flex
    align-items: center
    justify-content: center
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
    overflow: hidden
    padding: 5px 0
    border-radius: 5px
    background-color: var(--white)

    &::before
      position: absolute
      top: -8px
      left: 50%
      border-width: 0 8px 8px 8px
      border-style: solid
      border-color: transparent transparent #fff transparent
      content: ''
      transform: translateX(-50%)
    a
      display: block
      padding: 5px 10px
      text-align: center
      font-size: px(12)
      line-height: 1.5
      &:hover
        color: var(--primary-blue)

</style>