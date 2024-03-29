<script setup>
import { ref } from 'vue-demi';
import { useUserStore } from './../../stores/userStore';
import { socketStore } from './../../stores/socketStores';
import ChatRoomDropDown from './ChatRoomDropDown.vue';
import ChatRoomHeaderDropDown from './ChatRoomHeaderDropDown.vue';
import ToggleButton from '../ToggleButton.vue';
import { inject, onMounted, onUnmounted } from 'vue';
const userStore = useUserStore();
const mySocketStore = socketStore();

const socket = inject('socket');
const selectedChatroomIndex = ref(-1);

const joinRoom = (chatRoom, index) => {
  selectedChatroomIndex.value = index;
  socket.joinRoom(chatRoom);
};

let pullingChatroomList = null;

const isDisplayChatroomList = ref(true);
const isDisplayUserList = ref(true);

onMounted(() => {
  pullingChatroomList = setInterval(() => {
    socket.getChatroomList();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(pullingChatroomList);
});
</script>

<template>
  <div data-aos="clip-left" class="mb-4">
    <div class="chat-media">
      <h3 class="chat-media-header tw-py-1 tw-px-2 tw-h-10">
        <div class="tw-flex">
          <p class="mr-2">聊天室</p>
          <ToggleButton v-model:is-checked="isDisplayChatroomList"></ToggleButton>
        </div>
        <ChatRoomHeaderDropDown></ChatRoomHeaderDropDown>
      </h3>
      <ul class="mb-3 chatroom" v-show="isDisplayChatroomList">
        <li
          v-for="(chatroom, index) in mySocketStore.chatroomList"
          :key="chatroom._id"
        >
          <div
            :class="{
              'chat-media-item-active': selectedChatroomIndex === index,
            }"
            class="chat-media-item justify-between items-center d-flex px-2 py-1 mb-2"
            @dblclick="joinRoom(chatroom, index)"
          >
            <p class="">{{ chatroom.displayName }}</p>
            <div class="d-flex items-center">
              <p class="mr-2">{{ chatroom.unreadCount }}</p>
              <ChatRoomDropDown :chatroom="chatroom"></ChatRoomDropDown>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="chat-media" data-aos="clip-left">
    <h3 class="chat-media-header tw-py-2 tw-px-2 tw-h-10">
      <div class="tw-flex">
        <p class="mr-2">用戶</p>
        <ToggleButton v-model:is-checked="isDisplayUserList"></ToggleButton>
      </div>
    </h3>
    <ul class="user-list" v-show="isDisplayUserList">
      <li v-for="user in mySocketStore.userList" :key="user._id">
        <div class="chat-media-item px-1 py-2">
          <div class="headshot">
            <img v-if="user?.avatar" :src="user.avatar" alt="user-photo" />
          </div>
          <div class="position-relvate">
            <p
              :class="{ hidden: user.userStatus === 'offline' }"
              class="chat-media-item-content-online"
            >
              {{ user.nickName }}
            </p>
            <p
              :class="{ hidden: user.userStatus === 'online' }"
              class="chat-media-item-content-offline"
            >
              {{ user.nickName }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
@import '../../assets/sass/base/variables.sass';
@import '../../assets/sass/base/mixin.sass';

@media only screen and (max-width: 900px) {
  .chat-media {
    display: none;
  }
}

.hidden {
  display: none;
}
.p-3 {
  padding: 16px;
}

.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}

.py-1 {
  padding-top: 4px;
  padding-bottom: 4px;
}

.mb-2 {
  margin-bottom: 8px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--dark-white);
  margin-bottom: 4px;
  border-radius: 4px 4px 0px 0px;
}

.chat-media-item {
  position: relative;
  // padding: 4px 16px 4px 16px;
  display: flex;
  align-items: center;
}

.chat-media-item-active {
  background: rgba(7, 140, 235, 0.4);
  border-radius: 8px;
  box-shadow: 1px 2px 1px #869489;
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

.chatroom {
  height: 284px;

  overflow-y: auto;
  overflow-x: hidden;
}

.user-list {
  height: 384px;

  overflow-y: auto;
  overflow-x: hidden;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
