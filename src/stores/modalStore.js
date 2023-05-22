import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => {
    return {
      useModalPaid: false,
      useModalPay: false,
      useModalPayPostId:'',
      useModalPost: false,
      useModalLoader: false,
      useModalLoaderText: '',
      useModalFollows: false,
      useModalLikes: false,
      useModalAlert: false,
      useModalAlertText: '',
      useModalDeletePost: false,
      useModalDeletePostId: '',
      useModalDeleteComment: false,
      useModalDeleteCommentId: '',
      useModelCreateChatroom: false,
    }
  },
  actions: {
    openModalPaid() {
      this.useModalPaid = true
    },
    closeModalPaid() {
      this.useModalPaid = false
    },
    openModalPay(id) {
      this.useModalPay = true
      this.useModalPayPostId = id
    },
    closeModalPay() {
      this.useModalPay = false
    },
    openModalPost() {
      this.useModalPost = true
    },
    closeModalPost() {
      this.useModalPost = false
    },
    openModalLoader(val) {
      this.useModalLoader = true
      this.useModalLoaderText = val || ''
    },
    closeModalLoader() {
      this.useModalLoader = false
      this.useModalLoaderText = ''
    },
    openModalFollows() {
      this.useModalFollows = true
    },
    closeModalFollows() {
      this.useModalFollows = false
    },
    openModalLikes() {
      this.useModalLikes = true
    },
    closeModalLikes() {
      this.useModalLikes = false
    },
    openModalAlert(val) {
      this.useModalAlert = true
      this.useModalAlertText = val || 'Somethings went wrong.<br>Please try again.'
    },
    closeModalAlert() {
      this.useModalAlert = false
      this.useModalAlertText = ''
    },
    openModalDeletePost(id) {
      this.useModalDeletePost = true
      this.useModalDeletePostId = id
    },
    closeModalDeletePost() {
      this.useModalDeletePost = false
      this.useModalDeletePostId = ''
    },
    openModalDeleteComment(id) {
      this.useModalDeleteComment = true
      this.useModalDeleteCommentId = id
    },
    closeModalDeleteComment() {
      this.useModalDeleteComment = false
      this.useModalDeleteCommentId = ''
    },
    openModalCreateChatroomComment() {
      this.useModelCreateChatroom = true
    },
    closeModalCreateChatroomComment() {
      this.useModelCreateChatroom = false
    }
  }
})