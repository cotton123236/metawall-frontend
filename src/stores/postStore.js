import { defineStore } from 'pinia'
import router from './../router/router'

export const usePostStore = defineStore('postStore', {
  state: () => {
    return {
      posts: []
    }
  },
  actions: {
    async patchPosts(data) {
      this.posts.length = 0
      Object.assign(this.posts, data)
      console.log(this.posts)
    }
  }
})