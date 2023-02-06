import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

const userStore = useUserStore()

export const usePostStore = defineStore('postStore', {
  state: () => {
    return {
      currentPage: 1,
      hasNext: false,
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
    async patchProfilePosts(data) {
      const { _id } = userStore
      this.profilePosts.length = 0
      data.forEach(post => post.isLike = post.likes.some(item => item._id === _id || item === _id))
      Object.assign(this.profilePosts, data)
    },
    async pushPosts(data) {
      this.posts.push(...data)
    },
    async pushProfilePosts(data) {
      this.profilePosts.push(...data)
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
    async addPostComment(id, data){
      const index = this.posts.findIndex(item => item._id === id);
      this.posts[index].comments.splice(0, 0, data)
    },
    async addProfilePostComment(id, data) {
      const index = this.profilePosts.findIndex(item => item._id === id);
      this.profilePosts[index].comments.splice(0, 0, data)
    },
    async patchPostComment(postIdAndCommentId, data) {
      const splits = postIdAndCommentId.split('/')
      const postId = splits[0]
      const commentId = splits[1]
      const postIndex = this.posts.findIndex(item => item._id === postId)
      const commentIndex = this.posts[postIndex].comments.findIndex(item => item._id === commentId)
      this.posts[postIndex].comments.splice(commentIndex, 1, data)
    },
    async patchProfilePostComment(postIdAndCommentId, data) {
      const splits = postIdAndCommentId.split('/')
      const postId = splits[0]
      const commentId = splits[1]
      const postIndex = this.profilePosts.findIndex(item => item._id === postId)
      const commentIndex = this.profilePosts[postIndex].comments.findIndex(item => item._id === commentId)
      this.profilePosts[postIndex].comments.splice(commentIndex, 1, data)
    },
    async deletePostComment(postIdAndCommentId) {
      const splits = postIdAndCommentId.split('/')
      const postId = splits[0]
      const commentId = splits[1]
      const postIndex = this.posts.findIndex(item => item._id === postId)
      const commentIndex = this.posts[postIndex].comments.findIndex(item => item._id === commentId)
      this.posts[postIndex].comments.splice(commentIndex, 1)
    },
    async deleteProfilePostComment(postIdAndCommentId) {
      const splits = postIdAndCommentId.split('/')
      const postId = splits[0]
      const commentId = splits[1]
      const postIndex = this.profilePosts.findIndex(item => item._id === postId)
      const commentIndex = this.profilePosts[postIndex].comments.findIndex(item => item._id === commentId)
      this.profilePosts[postIndex].comments.splice(commentIndex, 1)
    },
    patchPostingData(data) {
      Object.assign(this.postingData, data)
    }
  }
})