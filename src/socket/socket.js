

import { io } from "socket.io-client";
const URL = "http://localhost:3010";
import { socketStore } from '../stores/socketStores';
export class Socket {
  socketStore = null;
  socket = null;
  roomId =""
  token
  constructor(
    socketStore
  ) {
    try {
      this.token = localStorage.getItem('token')
      this.socket = this.connectSocketServer(this.token);
      this.initSocketMethod();
      this.joinRoom();
      this.socketStore = socketStore;
    } catch (error) {
      console.log(error);
    }
  }

  getChatroomList() {
    console.log("do getChatroomList");
    this.socket.emit("getChatroomList", {});
  }

  getMessages() {
    this.socket.emit('getMessages', {
      roomId: this.roomId,
    });
  }
  addUser(userId,roomId) {
    this.socket.emit('addUserInRoom', { roomId: roomId, userId: userId});
  }

  connectSocketServer(userToken) {
    console.log('token', userToken);
    let socket = io(URL, {
      reconnectionDelayMax: 10000,
      query: {
        token: userToken,
      },
    });
    return socket;
  }

  getUserList() {
    console.log('getUserList');
    this.socket.emit('getUserList', {});
  }

  joinRoom() {
    const data = {
      roomId: this.roomId,
    };
    this.socket.emit('getUserInfo', { token: this.token });
    console.log('getUserInfo');
    this.socket.emit('joinRoom', data);
    this.socket.emit('sendJoinRoomMessage', data);
    this.getParticipantList();
    // getUserList();
  }

  sendMessage(userId, roomId, message) {
    console.log(userId, roomId, message);
    const data = {
      userId: userId,
      roomId: roomId,
      text: message,
    };
    this.socket.emit('chat', data);
  }

  getParticipantList() {
    this.socket.emit('getParticipantList', { roomId: this.roomId });
  }

  initSocketMethod() {
    console.log('socket', this.socket);
    this.socket.on("getChatroomListRequest", data=>{
      socket.emit("getChatroomList", {});
    });
  
    this.socket.on("getChatroomListResponse", userInfo => {
      console.log("getChatroomListResponse", userInfo);
      console.log(userInfo.conversations);
      if (userInfo.conversations) {
        this.socketStore.chatroomList = userInfo.conversations
        console.log(userInfo.conversations)
        // TODO 下次實現這裡顯示
        // userInfo.conversations.forEach((conversation, index) => {
        //   console.log("loop");
        //   const li = document.createElement("li");
        //   let innerHtml = "";
        //   innerHtml += /*html*/ `
        //   <div class="border border-1 border-dark rounded-2 p-4 mt-3">
        //     <div class="row">
        //       <div class="room-container  d-flex justify-content-between align-content-center ">
        //         <h5 font="noto" class="d-flex align-content-center mb-0 lh-base">${conversation.displayName}</h5>
        //         <button class="btn btn-warning" onclick="goChatPage(${index})">進入</button>
        //       </div>
        //     </div>
        //   `;
        //   innerHtml +=
        //     /*html*/ `<div class="row"><div class="col-1">` +
        //     createNameTags(conversation.participants) +
        //     /*html*/ `</div></div></div>`;
  
        //   innerHtml +=`<input type="text" name="CONVERSATION_ID_${index}" value="${conversation._id}" hidden>`;
        //   li.innerHTML = innerHtml;
        //   chatroomListEl.appendChild(li);
        // });
      }
  
      // appendMessage(data);
    });
    this.socket.on('showMessage', (chatMessage) => {
      console.log('showMessage', chatMessage);
      this.appendMessage(chatMessage);
      this.scrollToBottom(messageContainer);
    });

    this.socket.on('getMessagesResponse', (chatMessages) => {
      console.log('chatMessages', chatMessages);

      chatMessages.forEach((chatMessage) => {
        this.appendMessage(chatMessage);
      });
    });

    this.socket.on('getUserListResponse', (userList) => {
      console.log('getUserListResponse', userList);
      this.socketStore.userList = userList
      // this.appendUser(userList);
    });

    this.socket.on('joinRoomMessage', (data) => {
      console.log('joinRoomMessage', data);
      this.joinRoomMessage(data);
    });

    this.socket.on('leaveRoomMessage', (data) => {
      console.log('leaveRoomMessage', data);
      this.leaveRoomMessage(data);
      this.getUserList();
    });

    this.socket.on('getUserInfoResponse', (userInfo) => {
      console.log('getUserInfoResponse');
      this.userInfo = userInfo;
      this.getMessages();
    });

    this.socket.on('getParticipantListResponse', (conversation) => {
      console.log('getParticipantListResponse', conversation);
      this.participants = conversation.participants;
      this.setParticipantList(conversation.participants);
      this.getUserList();
    });
  }
}

export const socketPlugin = {
  install: (app, options) => {
    const socketStoreInstance = socketStore();
    const socket = new Socket(socketStoreInstance);

    app.config.globalProperties.$socket = socket;
  }
};