import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filterStore', {
  state: () => {
    return {
      filters: [
        {
          name: '最新貼文',
          sort: undefined
        },
        {
          name: '最舊貼文',
          sort: 'asc'
        },
        {
          name: '最熱門貼文',
          sort: 'hot'
        }
      ]
    }
  }
})

