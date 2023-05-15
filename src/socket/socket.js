

import { io } from "socket.io-client";
const { VITE_API_URL } = import.meta.env
const URL = VITE_API_URL;
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
      this.socketStore = socketStore;
    } catch (error) {
      console.log(error);
    }
  }
  setOnlineStatus(){
    this.socket.emit("setOnlineStatus", {  });
  }
  setOfflineStatus(){
    this.socket.emit("setOfflineStatus", {  });
  }

  createChatroom(roomName){
    this.socket.emit("createChatroom", {
      displayName: roomName,
    });
  }

  getChatroomList() {
    console.log("do getChatroomList");
    this.socket.emit("getChatroomList", {});
  }

  getMessages(roomId) {
    this.socket.emit('getMessages', {
      roomId: roomId,
    });
  }
  addUser(userId,roomId) {
    console.log("addUser");
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

  joinRoom(chatroom) {
    console.log("chatroom",chatroom);
    const data = {
      roomId: chatroom._id,
    };
    // this.socket.emit('getUserInfo', { token: this.token });
    console.log('getUserInfo');
    this.socket.emit('joinRoom', data);

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

  getParticipantList(roomId) {
    this.socket.emit('getParticipantList', { roomId: roomId });
  }

  leaveChatroom(roomId){
    this.socket.emit("leaveChatroom", {
      roomId
    });
  }

  setParticipantList(participants) {
    this.socketStore.chatroomList.participants = participants
    // participants.forEach(participant => {
    //   console.log("loop user list");
    //   const participantElement = document.createElement("li");
    //   let innerHtml = /*html*/ `
    //       <li class="p-2">
    //         <div class="d-flex justify-content-between align-items-center border border-1 rounded-2 p-2">
    //           <p font="noto" class="lh-base ms-4 mb-0">${participant.nickName}</p>
    //         </li>
    //         `;
    //   participantElement.innerHTML = innerHtml;
    //   participantListElement.append(participantElement);
    // });
  }

  appendMessage(chatMessage){
    this.socketStore.addChatMessage(chatMessage);
  }

  patchUserList(updatedUser){
    console.log("updatedUser",updatedUser);
    const updatedList = this.socketStore.userList.map(user => {
      if (user._id === updatedUser._id) {
        return {...user, ...updatedUser};
      } else {
        return user;
      }
    });
  
    return updatedList;
  }

  initSocketMethod() {
    console.log('socket', this.socket);
    this.socket.on("connect", () => {
      console.log("connected", this.socket.connected); // true
      if(!this.socket.connected){
        socket.close();
      }
    });

    this.socket.on("getChatroomListRequest", data=>{
      this.socket.emit("getChatroomList", {});
    });
  
    this.socket.on("getChatroomListResponse", userInfo => {
      console.log("getChatroomListResponse", userInfo);
      console.log(userInfo.conversations);
      if (userInfo.conversations) {
        this.socketStore.chatroomList = userInfo.conversations
        console.log(userInfo.conversations)
      }
    });
    this.socket.on('showMessage', (chatMessage) => {
      console.log('showMessage', chatMessage);
      this.appendMessage(chatMessage);
      // this.scrollToBottom(messageContainer);
    });

    this.socket.on('updateUserStatusResponse', (response) => {
      console.log('updateUserStatusResponse', response);
      this.socketStore.userList = this.patchUserList(response.data)
    });

    this.socket.on('getMessagesResponse', (response) => {
      console.log('chatMessages', response);
      this.socketStore.chatMessages = response.data
    });

    this.socket.on('getUserListResponse', (response) => {
      console.log('getUserListResponse', response);
      this.socketStore.userList = response.data
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

    this.socket.on('leaveChatroomResponse', (data) => {
      console.log('leaveChatroomResponse', data);
      this.getChatroomList();
    });
    this.socket.on('addUserInRoomResponse', (data) => {
      console.log('addUserInRoomResponse', data);
      // this.getChatroomList();
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

    this.socket.on('joinRoomSuccess',(conversation)=>{
      console.log("joinRoomSuccess", conversation);
      this.socketStore.connectedChatroom=conversation
      this.socket.emit('sendJoinRoomMessage', {roomId:conversation._id});
      this.getParticipantList(conversation._id);
      this.getMessages(conversation._id);
    })

    this.socket.on('error',(data)=>{
      console.log(data);
    })
  }
}

export const socketPlugin = {
  install: (app, options) => {
    const socketStoreInstance = socketStore();
    const socket = new Socket(socketStoreInstance);
    socket.setOnlineStatus();
    app.config.globalProperties.$socket = socket;
  }
};