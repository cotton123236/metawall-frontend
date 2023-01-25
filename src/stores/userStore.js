import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      _id: '',
      name: '',
      image: '',
      follows: [],
      likes: [],
      donatedAmount: 0
    }
  },
  actions: {
    async patchUser(data) {
      this.$patch({
        ...data
      })
    }
  }
})