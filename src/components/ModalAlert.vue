<script setup>
import { storeToRefs } from "pinia";
import { useModalStore } from "./../stores/modalStore";

const modalStore = useModalStore();
const { useModalAlertText } = storeToRefs(modalStore)
const { closeModalAlert } = modalStore

</script>

<template>
  <div class="modal-wrapper modal-delete-post">
    <div class="modal-bg" @click="closeModalAlert"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalAlert"></div>
        <div class="modal-body">
          <p v-html="useModalAlertText"></p>
        </div>
      </div>
    </div>
  </div>
  <div>
    <span>{{ useModalAlertText }}</span>
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
    padding: 80px 20px
    text-align: center
    p
      font-size: px(14)
      line-height: 1.5
      color: var(--gray)
</style>