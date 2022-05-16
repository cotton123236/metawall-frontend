import { defineStore } from 'pinia'
import axios from 'axios'
import router from './../router/router'

export const useStore = defineStore('main', {
  state: () => {
    return {
      isLogin: true,
      user: {},
      posts: [],
      useModalPost: false,
      useModalLoader: false,
      useModalFollows: false,
      useModalLikes: false,
      filters: [
        {
          name: '最新貼文',
          sort: undefined
        },
        {
          name: '最舊貼文',
          sort: 'timeasc'
        },
        {
          name: '最熱門貼文',
          sort: 'hot'
        }
      ]
    }
  },
  actions: {
    changeModalPostState() {
      this.useModalPost = !this.useModalPost
    },
    changeModalLoaderState() {
      this.useModalLoader = !this.useModalLoader
    },
    changeModalFollowsState() {
      this.useModalFollows = !this.useModalFollows
    },
    changeModalLikesState() {
      this.useModalLikes = !this.useModalLikes
    },
    useDateFormat(date) {
      const timeDiff = {
        day: 86400000,
        hour: 3600000,
        minute: 60000
      }
      const now = new Date()
      const time = new Date(date)
      const diff = now.getTime() - time.getTime()
      if (diff >= timeDiff.day) {
        const yyyy = time.getFullYear()
        const mm = String(time.getMonth() + 1).padStart(2, '0')
        const dd = String(time.getDate()).padStart(2, '0')
        return `${yyyy}/${mm}/${dd}`
      }
      else if (diff < timeDiff.day && diff >= timeDiff.hour) {
        const hours = parseInt(diff / timeDiff.hour)
        return `${hours} 小時前`
      }
      else if (diff < timeDiff.hour && diff >= timeDiff.minute) {
        const mins = parseInt(diff / timeDiff.minute)
        return `${mins} 分鐘前`
      }
      else {
        const secs = parseInt(diff / 1000)
        return `${secs} 秒前`
      }
    },
    async getUser(url, userId) {
      const res = await axios.get(`${url}/${userId}`)
      if (!res.data) return;
      const { data } = res.data
      Object.assign(this.user, data)
    },
    async getPosts(route, url) {
      const { query } = route
      const keys = Object.keys(query)
      // let url = route
      keys.forEach((key, i) => {
        if (i === 0) url += `?${key}=${query[key]}`
        else url += `&${key}=${query[key]}`
      })
      // axios data
      const res = await axios.get(url)
      if (!res.data) return;
      this.posts.length = 0
      Object.assign(this.posts, res.data.data)
      console.log(this.posts)
    },
    async appendQuery(route, newQuery) {
      // create query
      const key = Object.keys(newQuery)[0]
      const value = newQuery[key]
      const query = Object.assign({}, route.query, newQuery)
      if (!value) delete query[key]
      // push query
      await router.push({ query })
    }
  }
})

