

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
    this.socketStore.connectedChatroom.participants = participants;
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

  resetUnreadCount(roomId){
    this.socket.emit('resetUnreadCount', { roomId: roomId});
  }

  initSocketMethod() {
    console.log('socket', this.socket);
    this.socket.on("connect", () => {
      console.log("connected", this.socket.connected); // true
      if(!this.socket.connected){
        socket.close();
      }
    });

    this.socket.on("getChatroomListRequest", response=>{
      this.socket.emit("getChatroomList", {});
    });
  
    this.socket.on("getChatroomListResponse", response => {
      console.log("getChatroomListResponse", response.data);
      console.log(response.data.conversations);
      if (response.data.conversations) {
        this.socketStore.chatroomList = response.data.conversations
        console.log(response.data.conversations)
      }
    });
    this.socket.on('chatResponse', (response) => {
      console.log('chatResponse', response);
      this.appendMessage(response.data);
      this.getChatroomList();
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

    this.socket.on('joinRoomMessage', (response) => {
      console.log('joinRoomMessage', response.data);
      this.joinRoomMessage(data);
    });

    this.socket.on('leaveRoomMessage', (response) => {
      console.log('leaveRoomMessage', response);
      this.leaveRoomMessage(response.data);
      this.getUserList();
    });

    this.socket.on('leaveChatroomResponse', (response) => {
      console.log('leaveChatroomResponse', response);
      this.getChatroomList();
    });
    this.socket.on('addUserInRoomResponse', (response) => {
      console.log('addUserInRoomResponse', response);
      // this.getChatroomList();
      this.getParticipantList(this.socketStore.connectedChatroom._id);
    });

    this.socket.on('getUserInfoResponse', (response) => {
      console.log('getUserInfoResponse');
      this.userInfo = response.data;
      this.getMessages();
    });

    this.socket.on('getParticipantListResponse', (response) => {
      console.log('getParticipantListResponse', response);
      this.participants = response.data.participants;
      this.setParticipantList(response.data.participants);
      this.getUserList();
    });

    this.socket.on('joinRoomResponse',(response)=>{
      console.log("joinRoomResponse", response);
      this.socketStore.connectedChatroom=response.data
      this.socket.emit('sendJoinRoomMessage', {roomId:response.data._id});
      this.getParticipantList(response.data._id);
      this.getMessages(response.data._id);
      this.resetUnreadCount(response.data._id);
    })

    this.socket.on("updateUnreadCount", (response) => {
      console.log('updateUnreadCount', response);
      const chatroom = this.socketStore.chatroomList.find((chatroom)=>{
        return chatroom._id===response.data.conversation;
      });
      console.log("chatroom",chatroom);
      if(chatroom){
        chatroom.unreadCount = response.data.unreadCount
      }
      
    })


    this.socket.on('error',(response)=>{
      console.log(response);
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