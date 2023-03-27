import { defineStore } from 'pinia'

export const socketStore = defineStore('counter', {
  state: () => {
    return { 
      chatroomList : [
        new ChatRoom()
      ],
      userList:[]
     }
  },
  actions: {
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
