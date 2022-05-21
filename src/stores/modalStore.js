import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => {
    return {
      useModalPost: false,
      useModalLoader: false,
      useModalFollows: false,
      useModalLikes: false
    }
  },
  actions: {
    openModalPost() {
      this.useModalPost = true
    },
    closeModalPost() {
      this.useModalPost = false
    },
    openModalLoader() {
      this.useModalLoader = true
    },
    closeModalLoader() {
      this.useModalLoader = false
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
    }
  }
})