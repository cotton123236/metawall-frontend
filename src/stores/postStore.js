import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

const userStore = useUserStore()

export const usePostStore = defineStore('postStore', {
  state: () => {
    return {
      posts: [],
      profilePosts: [],
      postingData: {
        _id: '',
        content: '',
        image: []
      }
    }
  },
  actions: {
    async patchPosts(data) {
      const { _id } = userStore
      this.posts.length = 0
      data.forEach(post => post.isLike = post.likes.some(item => item._id === _id || item === _id))
      Object.assign(this.posts, data)
      // console.log(this.posts)
    },
    patchPostLikes(id, likes) {
      const postsIndex = this.posts.findIndex(item => item._id === id)
      if (postsIndex > -1) this.posts[postsIndex].likes = likes
      const profileIndex = this.profilePosts.findIndex(item => item._id === id)
      if (profileIndex > -1) this.profilePosts[profileIndex].likes = likes
    },
    patchPostLikeStats(id, state) {
      const postsIndex = this.posts.findIndex(item => item._id === id)
      if (postsIndex > -1) this.posts[postsIndex].isLike = state
      const profileIndex = this.profilePosts.findIndex(item => item._id === id)
      if (profileIndex > -1) this.profilePosts[profileIndex].isLike = state
    },
    async patchProfilePosts(data) {
      const { _id } = userStore
      this.profilePosts.length = 0
      data.forEach(post => post.isLike = post.likes.some(item => item._id === _id || item === _id))
      Object.assign(this.profilePosts, data)
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