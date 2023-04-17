import { defineStore } from 'pinia'

export const socketStore = defineStore('counter', {
  state: () => {
    return { 
      connectedChatroom: new ChatRoom(),
      chatroomList : [
        new ChatRoom()
      ],
      userList:[],
      chatMessages : []
     }
  },
  actions: {
    addChatMessage(chatMessage){
      this.chatMessages.push(chatMessage)
    }
  },
})


export class ChatRoom {
  displayName="";
  participants = [
    new Participant()
  ]
  _id="";
}

export class Participant {
  nickName="";
  userStatus="";
  _id=""
}
