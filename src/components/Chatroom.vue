<script setup>
import { connectSocket } from '../socket/resources/login.js';
import { ref } from 'vue-demi';
import { useUserStore } from './../stores/userStore';
import { socketStore } from './../stores/socketStores';
const userStore = useUserStore();
const mySocketStore = socketStore();
const message = ref('');

const connect = () => {
  // init()
};
const getChatInfo = () => {
  socket.getChatroomList();
  socket.getUserList();
};

const localSendMessage = () => {
  socket.sendMessage(userStore._id, '123123', message.value);
  message.value = '';
};
</script>
<template>
  <div class="chatroom-wrapper">
    <div class="chatroom">
      <h3 class="chat-media-header">用戶</h3>
      <ul>
        <li v-for="user in mySocketStore.userList" :key="user._id">
          <div class="chat-media-item px-1 py-2">
            <div class="headshot">
              <img v-if="user?.avatar" :src="user.avatar" alt="user-photo" />
            </div>
            <p :class="{ 'hidden': user.userStatus==='offline' }" class="chat-media-item-content-online">{{ user.nickName }}</p>
            <p :class="{ 'hidden': user.userStatus==='online' }" class="chat-media-item-content-offline">{{ user.nickName }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped="scss">
.chatroom-wrapper {
  position: absolute;
  bottom: 0;
  right: 60px;
}

.chatroom {
  padding: 4px;
  background: #fff;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
  border-radius: 8px 8px 0px 0px;
  width: 320px;
}
</style>