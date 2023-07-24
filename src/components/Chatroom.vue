<script setup>
import { ref } from "vue-demi";
import { useUserStore } from "./../stores/userStore";
import { socketStore } from "./../stores/socketStores";
import { inject, onMounted, computed, watch, nextTick } from "vue";
import { useModalStore } from './../stores/modalStore'
import { uploadPostImage } from './../api/fetch'

const modalStore = useModalStore();
const userStore = useUserStore();
const mySocketStore = socketStore();
const socket = inject("socket");
const message = ref("");
const zoomOut = ref(false);
const chatroomContentRef = ref(null);

const { openModalInvitation, openModalImage, openModalLoader, closeModalLoader, } = modalStore;

const imageFile = ref(null);
async function addImage() {
  openModalLoader('上傳中');
  const uploadedFile = imageFile.value.files[0];
  console.dir(uploadedFile);

  const formData = new FormData();
  formData.append("file-to-upload", uploadedFile);

  const { data } = await uploadPostImage(formData);
  if (data.status === "success") {
    sendMessage(data.data.upload);
  }
  closeModalLoader()
}

function sendMessage(picture = '') {
  if (picture === '' && message.value === '') return
  socket.sendMessage(userStore._id, mySocketStore.connectedChatroom._id, message.value, picture);
  socket.whenChatroomHasUnreadResetUnreadCount();
  message.value = "";
}

const roomNameFirstWordUpperCase = computed(() => {
  return mySocketStore.connectedChatroom.displayName.charAt(0).toUpperCase();
});

function closeChatroom() {
  mySocketStore.connectedChatroom._id = "";
}

function openChatroom() {
  zoomOut.value = false;
}

function zoomOutChatroom() {
  zoomOut.value = true;
}

// scroll to bottom
function scrollToBottom() {
  chatroomContentRef.value.scrollTop = chatroomContentRef.value.scrollHeight;
}

watch(
  () => mySocketStore.chatMessages,
  value => {
    if (value !== null && value !== undefined && value.length > 0) {
      nextTick(() => {
        scrollToBottom();
      })
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  socket.getParticipantList(mySocketStore.connectedChatroom._id);
});

</script>
<template>
  <div
    class="chatroom-wrapper"
    v-show="mySocketStore.connectedChatroom._id?.length > 0 && !zoomOut"
  >
    <div class="chatroom">
      <div class="chat-media-header">
        <button class="tw-top-4 tw-left-4 tw-bg-transparent tw-border-none tw-font-bold tw-text-gray-200 tw-cursor-pointer hover:tw-text-white tw-text-sm tw-p-0 text" @click="openModalInvitation">邀請</button>
        <h3>{{ mySocketStore.connectedChatroom.displayName }}</h3>
        <div class="chatroom-control-wrapper">
          <div class="zoom-out" @click="zoomOutChatroom">&#x2014;</div>
          <div class="close" @click="closeChatroom">&#x2716;</div>
        </div>
      </div>
      <div class="chatroom-users">
        <ul class="chatroom-users-avatar">
          <li v-for="participant of mySocketStore.connectedChatroom.participants">
            <img :src="participant.avatar" alt="" />
          </li>
        </ul>
      </div>
      <ul class="chatroom-content" ref="chatroomContentRef">
        <li class="mb-4" v-for="message in mySocketStore.chatMessages" :key="message._id">
          <div
            v-if="message.sender._id !== userStore._id"
            class="chat-media-item px-1 py-2 tw-flex tw-items-start tw-mb-4 tw-w-full"
          >
            <div class="d-flex items-center mb-4">
              <div class="headshot mr-2">
                <img
                  v-if="message.sender?.avatar"
                  :src="message.sender.avatar"
                  alt="user-photo"
                />
              </div>
            </div>

            <div class="tw-w-[85%]">
              <div class="chatroom-username">
                {{ message.sender.nickName }}
              </div>
              <div class="message balloon">
                <div class="chat-image" v-if="message.image" @click="openModalImage(message.image)">
                  <img :src="message.image" alt="image">
                </div>
                {{ message.text }}
              </div>
            </div>
          </div>

          <div
            v-if="message.sender._id === userStore._id"
            class="chat-media-item px-1 py-2 tw-flex tw-flex-row-reverse tw-items-start tw-mb-4 tw-w-full"
          >
            <div class="d-flex justify-end items-center mb-4">
              <div class="headshot tw-ml-2">
                <img
                  v-if="message.sender?.avatar"
                  :src="message.sender.avatar"
                  alt="user-photo"
                />
              </div>              
            </div>

            <div class="tw-flex tw-flex-col tw-items-end tw-w-[85%]">
              <div class="chatroom-username">
                {{ message.sender.nickName }}
              </div>
              <div class="message balloon-owner">
                <div class="chat-image" v-if="message.image" @click="openModalImage(message.image)">
                  <img :src="message.image" alt="image">
                </div>
                {{ message.text }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="d-flex chatroom-footer">
        <label class="editor-btn">
          <i class="icon-picture"></i>
          <input type="file" @change="addImage" accept="image/*" ref="imageFile">
        </label>
        <input class="send-message-input" type="text" v-model="message" />
        <button class="send-message-button" @click="sendMessage()">
          <img class="tw-w-[20px]" src="../assets/icons/svg/submit.svg" alt="submit-icon">
        </button>
      </div>
    </div>
  </div>
  <div
    class="chatroom-zoom-out"
    v-show="mySocketStore.connectedChatroom._id?.length > 0 && zoomOut"
    @click="openChatroom"
  >
    <div class="chatroom-zoom-out-close" @click="closeChatroom">&#x2716;</div>
    <div>{{ roomNameFirstWordUpperCase }}</div>
  </div>
</template>
<style scoped="scss">
.headshot {
  width: 24px;
  height: 24px;
}

.chatroom-wrapper {
  position: fixed;
  right: 60px;
  bottom: 0;
  z-index: 2;

  @media screen and (max-width: 900px) {
    bottom: 91px;
    top: 65px;
    right: 0;
    left: 0;
  }
}

.chat-media-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 8px;
  border-radius: 8px 8px 0 0;
  background: #256693;
  color: #fff;
}

.chatroom-control-wrapper {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.zoom-out,
.close {
  cursor: pointer;
  font-size: 18px;
  color: #ccc;
}

.zoom-out {
  font-weight: bold;
}

.zoom-out:hover,
.close:hover {
  color: #fff;
}

.chatroom-users-avatar {
  overflow-y: auto;
  margin: 0 auto;
  white-space: nowrap;
  padding: 5px 0;
  width: fit-content;
  max-width: 100%;

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  }
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(108, 110, 113, 1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);   
  }
}

.chatroom-users-avatar li {
  display: inline-block;
  margin: 0 5px;
}

.chatroom-users-avatar li > img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.chatroom {
  padding-bottom: 16px;
  width: 320px;
  border-radius: 8px 8px 0 0;
  /* padding: 4px; */
  background: #fff;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
  
  @media screen and (max-width: 900px) {
    width: 100%;
  }
}

.chatroom-username {
  font-size: 0.75rem;
}

.chatroom-content {
  padding: 8px;
  height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(108, 110, 113, 1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  }
  
  @media screen and (max-width: 900px) {
    height: calc(100vh - 270px);
  }
}

.chatroom-footer {
  padding: 0 8px;
}

.editor-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;
  border-radius: 5px;
}

input[type="file"] {
  display: none;
}

.message {
  word-wrap: break-word;
  width: fit-content;
  min-width: 25px;
  max-width: 100%;
  border-radius: 8px;
  color: #333;
  font-size: 0.75rem;
  margin-top: 4px;
}

/* .message:has(.chat-image) {
  width: 50%;
} */

.chat-image {
  width: 50%;
  cursor: pointer;
}

.chat-image > img {
  width: 160px;
  object-fit: cover;
  object-position: center;
}

.send-message-input {
  padding: 8px;
  width: 100%;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
}

.send-message-button {
  border-radius: 0 8px 8px 0;
  border-left: 0;
  background: #fff;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
}

.send-message-button:hover {
  background: #256693;
}

.send-message-button:hover > img {
  filter: brightness(100)
}

/* 吹き出し本体 */
.balloon {
  position: relative;
  padding: 8px;
  border: 1px solid #333;
  background-color: #fff;
}

/* 吹き出し本体 */
.balloon-owner {
  position: relative;
  padding: 8px;
  border: 1px solid #333;
  background-color: #dcddde;
  margin-left: auto;
}

.p {
  position: relative;
}

.chatroom-zoom-out {
  width: 50px;
  height: 50px;
  position: fixed;
  right: 60px;
  bottom: 60px;
  border-radius: 50%;
  background-color: #587de0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
}

.chatroom-zoom-out-close {
  width: 20px;
  height: 20px;
  color: #fff;
  background-color: #f00;
  border: 1px solid #fff;
  border-radius: 50%;
  position: absolute;
  font-size: 12px;
  top: -5px;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.5s;
}

.chatroom-zoom-out:hover > .chatroom-zoom-out-close {
  opacity: 1;
}
</style>