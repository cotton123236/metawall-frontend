  <script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue-demi";
import { useModalStore } from "../stores/modalStore";
import { inject } from "vue";
const modalStore = useModalStore();
const { useModalAlertText } = storeToRefs(modalStore);
const { closeModalCreateChatroomComment } = modalStore;
const socket = inject("socket");
const chatroomName = ref("");

const closeModalCreateChatroomHandler = () => {
  closeModalCreateChatroomComment();
};

const submit = () => {
  if (chatroomName.value !== "") {
    socket.createChatroom(chatroomName.value);
    closeModalCreateChatroomHandler();
  }
};
</script>

<template>
  <div class="modal-wrapper modal-post">
    <div class="modal-bg" @click="closeModalCreateChatroomHandler"></div>
    <div class="modal-content">
      <div class="modal">
        <div class="close-btn" @click="closeModalCreateChatroomHandler"></div>
        <div class="modal-head">
          <span>建立聊天室</span>
        </div>
        <div class="modal-body">
          <div class="content">
            <div class="d-flex justify-center items-center">
              <div class="input-wrapper">
                <input
                  class="input"
                  type="text"
                  maxlength="30"
                  placeholder="請輸入聊天室名稱"
                  v-model="chatroomName"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-foot">
          <div
            class="rect-btn fill"
            :class="{
              disable: isSubmitDisable,
            }"
            @click="submit"
          >
            建立聊天室
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

// modal-create-chatroom
.modal-content
  pointer-events: none
.modal
  position: relative
  width: 90%
  max-width: 600px
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
    padding: 20px 40px 0
    +rwdmax(767)
      padding: 20px 20px 0
    .info
      display: flex
      align-items: center
    .headshot
      width: 50px
      height: 50px
      margin-right: 15px
    .name
      font-family: $code-font
      line-height: 1.5
    .content
      padding: 20px 0 0
    // .picture
    //   width: 100%
    //   img
    //     width: 100%
  .modal-foot
    padding: 20px
    +rwdmax(767)
      padding: 10px
.input
  padding: 16px
  border-radius: 16px
  font-size: 24px
</style>
