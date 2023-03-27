<script setup>
import { ref } from 'vue-demi';
import { useUserStore } from './../stores/userStore';
import { socketStore } from './../stores/socketStores';
import {inject } from "vue";
const userStore = useUserStore();
const mySocketStore = socketStore();

const socket = inject("socket");
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
  <div>
    <button @click="connect()">連線聊天室</button>
    <button @click="getChatInfo()">取得聊天室資訊</button>
    <input type="text" v-model="message" />
    <button @click="localSendMessage()">送信</button>
    <ul class="chat-media mb-3">
      <h3 class="chat-media-header">聊天室</h3>
      <li v-for="chatroom in mySocketStore.chatroomList" :key="chatroom._id">
        <div class="chat-media-item p-3">
          <p class="">{{ chatroom.displayName }}</p>
        </div>
      </li>
    </ul>
  </div>
  <div class="chat-media">
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
</template>
<style lang="scss" scoped>
.hidden {
  display: none;
}
.p-3 {
  padding: 16px;
}
.mb-3 {
  margin-bottom: 16px;
}

.px-1 {
  padding-left: 4px;
  padding-right: 4px;
}

.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.chatting-groups {
  list-style: none;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
  margin-bottom: 16px;
}

.chatting-group {
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px;

  &--hover:hover {
    background: #869489;
  }
}

.chat-media {
  padding: 4px;
  background: #fff;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
  // height: 320px;
  border-radius: 8px 8px 8px 8px;
}

.chat-media-header {
  background-color: var(--dark-white);
  padding: 16px 8px 16px 8px;
  margin-bottom: 4px;
  border-radius: 4px 4px 0px 0px;
}

.chat-media-item {
  position: relative;
  // padding: 4px 16px 4px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.chat-media-item:hover {
  background: rgba(7, 140, 235, 0.4);
  border-radius: 8px;
  box-shadow: 1px 2px 1px #869489;
}

.chat-media-item-photo {
  height: 40px;
  width: 40px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  box-shadow: 0 0 5px rgb(0 0 0 / 10%);
  margin-right: 16px;
}

.chat-media-item-content-online::after {
  position: absolute;
  content: '　';
  background: green;
  border-radius: 50%;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
}
.chat-media-item-content-offline::after {
  position: absolute;
  content: '　';
  background: gray;
  border-radius: 50%;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
}



.headshot {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  width: 40px;
  height: 40px;
}
</style>
