import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    _id: '',
    name: '',
    image: '',
    gender: '',
    follows: [],
    likes: []
  }),
  actions: {
    async patchUser(data) {
      this.$patch({
        ...data
      })
    }
  }
})