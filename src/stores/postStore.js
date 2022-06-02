import { defineStore } from 'pinia'
import router from './../router/router'

export const usePostStore = defineStore('postStore', {
  state: () => {
    return {
      posts: [],
      postingData: {
        _id: '',
        content: '',
        image: []
      }
    }
  },
  actions: {
    async patchPosts(data) {
      this.posts.length = 0
      Object.assign(this.posts, data)
      console.log(this.posts)
    },
    async patchPostComment(id, data){
      const index = this.posts.findIndex(item => item._id === id);
      this.posts[index].comments.splice(0, 0, data)
    },
    patchPostingData(data) {
      Object.assign(this.postingData, data)
    }
  }
})