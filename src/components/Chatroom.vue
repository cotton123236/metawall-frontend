<script setup>
import { ref } from 'vue-demi';
import { useUserStore } from './../stores/userStore';
import { socketStore } from './../stores/socketStores';
import { inject } from "vue";
const userStore = useUserStore();
const mySocketStore = socketStore();
const socket = inject("socket");
const message = ref('');

const sendMessage = () => {
  socket.sendMessage(userStore._id, mySocketStore.connectedChatroom._id, message.value);
  message.value = '';
};
</script>
<template>
  <div class="chatroom-wrapper" v-if="mySocketStore.connectedChatroom._id.length > 0">
    <div class="chatroom">
      <h3 class="chat-media-header">{{ mySocketStore.connectedChatroom.displayName }}</h3>
      <ul class="chatroom-content">
        <li class="mb-4" v-for="message in mySocketStore.chatMessages" :key="message._id">
          <div v-show="message.sender._id!==userStore._id" class="chat-media-item px-1 py-2">
            <div class="d-flex items-center mb-4">
              <div class="headshot mr-2">
                <img v-show="message.sender?.avatar" :src="message.sender.avatar" alt="user-photo" />
              </div>
              <div class="chatroom-username">
                {{ message.sender.nickName }}
              </div>
            </div>
            <div class="message balloon">
              {{ message.text }}
            </div>
          </div>

          <div v-show="message.sender._id===userStore._id" class="chat-media-item px-1 py-2">
            <div class="d-flex justify-end items-center mb-4">
              <div class="headshot mr-2">
                <img v-show="message.sender?.avatar" :src="message.sender.avatar" alt="user-photo" />
              </div>
              <div class="chatroom-username">
                {{ message.sender.nickName }}
              </div>
            </div>
            <div class="message balloon-owner">
              {{ message.text }}
            </div>
          </div>
        </li>
      </ul>
      <div class="d-flex chatroom-footer">
        <input class="send-message-input" type="text" v-model="message">
        <button class="send-message-button" @click="sendMessage()">送信</button>
      </div>
    </div>
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
}

.chat-media-header {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  padding: 16px 4px;
  border-radius: 8px 8px 0 0;
  background: #256693;
  color: #fff;
}

.chatroom {
  padding-bottom: 16px;
  width: 320px;
  border-radius: 8px 8px 0 0;
  /* padding: 4px; */
  background: #fff;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
}

.chatroom-username {
  font-size: 0.75rem;
}

.chatroom-content {
  padding: 8px;
}

.chatroom-footer {
  padding: 0 8px;
}

.message {
  display: flex;
  border-radius: 8px;
  color: #fff;
  font-size: 0.75rem;
}

.send-message-input {
  padding: 8px;
  width: 100%;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
}

.send-message-button {
  border-radius: 0 8px 8px 0;
  background: #256693;
  color: #fff;
}

.send-message-button:hover {
  background: #1a4869;
}

/* 吹き出し本体 */
.balloon {
  position: relative;
  padding: 8px;
  border: 2px solid #256693;
  background-color: #587de0;
}

/* beforeで枠線の三角を表現 */
.balloon::before {
  position: absolute;
  top: -15px;
  left: 12px;
  display: block;
  width: 0;
  height: 0;
  border-right: 15px solid transparent;
  border-bottom: 15px solid #256693;
  border-left: 15px solid transparent;
  content: '';
}

/* beforeで本体の三角を表現 */
.balloon::after {
  position: absolute;
  top: -12px;
  left: 12px;
  display: block;
  width: 0;
  height: 0;
  border-right: 15px solid transparent;
  border-bottom: 15px solid #587de0;
  border-left: 15px solid transparent;
  content: '';
}

/* 吹き出し本体 */
.balloon-owner {
  position: relative;
  padding: 8px;
  border: 2px solid #5a7853;
  background-color: #56ab43;
}

/* beforeで枠線の三角を表現 */
.balloon-owner::before {
  position: absolute;
  top: -15px;
  right: 12px;
  display: block;
  width: 0;
  height: 0;
  border-right: 15px solid transparent;
  border-bottom: 15px solid #5a7853;
  border-left: 15px solid transparent;
  content: '';
}

/* beforeで本体の三角を表現 */
.balloon-owner::after {
  position: absolute;
  top: -12px;
  right: 12px;
  display: block;
  width: 0;
  height: 0;
  border-right: 15px solid transparent;
  border-bottom: 15px solid #56ab43;
  border-left: 15px solid transparent;
  content: '';
}

.p {
  position: relative;
}

</style>