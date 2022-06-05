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
    async addPostComment(id, data){
      const index = this.posts.findIndex(item => item._id === id);
      this.posts[index].comments.splice(0, 0, data)
    },
    async patchPostComment(potIdAndCommentId, data) {
      const splits = potIdAndCommentId.split('/')
      const postId = splits[0]
      const commentId = splits[1]
      const postIndex = this.posts.findIndex(item => item._id === postId)
      const commentIndex = this.posts[postIndex].comments.findIndex(item => item._id === commentId)
      this.posts[postIndex].comments.splice(commentIndex, 1, data)
    },
    async deletePostComment(potIdAndCommentId) {
      const splits = potIdAndCommentId.split('/')
      const postId = splits[0]
      const commentId = splits[1]
      const postIndex = this.posts.findIndex(item => item._id === postId)
      const commentIndex = this.posts[postIndex].comments.findIndex(item => item._id === commentId)
      this.posts[postIndex].comments.splice(commentIndex, 1)
    },
    patchPostingData(data) {
      Object.assign(this.postingData, data)
    }
  }
})