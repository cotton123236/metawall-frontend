<script setup>
import { ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useStore } from './../stores/stores'


const route = useRoute()
const store = useStore()
const { VITE_API_URL } = import.meta.env
const { appendQuery, getPosts } = store

const postUrl = `${VITE_API_URL}/api/posts`

// search content handler
const { content } = route.query || ''
const searchValue = ref(content)

const searchPosts = async () => {
  // push query
  const queries = {
    content: searchValue.value
  }
  await appendQuery(route, queries)
  // then get data
  getPosts(route, postUrl)
}

const clearInput = () => {
  searchValue.value = ''
}

</script>

<template>
  <label class="searcher">
    <input type="text" placeholder="搜尋貼文" v-model="searchValue" @keyup.enter="searchPosts">
    <i class="icon-search"></i>
    <i class="icon-cancel" @click="clearInput"></i>
  </label>
</template>

<style lang="sass">
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

// searcher
.searcher
  position: relative
  display: flex
  align-items: center
  height: 30px
  width: 200px
  background-color: var(--background)
  padding: 10px 20px
  margin-right: 10px
  border-radius: 15px
  overflow: hidden
  input[type="text"]
    width: 90%
    border: none
    background: none
    font-family: $basic-font
    font-size: px(14)
    letter-spacing: .02em
    font-weight: 300
    color: var(--gray)
    padding-left: 20px
    transition: padding var(--trans-s)
    &::placeholder
      color: #ccc
    &:focus
      padding-left: 0
      padding-right: 10px
      & + .icon-search
        opacity: 0
        transform: translate(-20px, -50%)
      & ~ .icon-cancel
        opacity: 1
        transform: translate(0, -50%)
        pointer-events: auto
        transition: transform var(--trans-s), opacity var(--trans-s)
  .icon-search, .icon-cancel
    position: absolute
    top: 50%
    transform: translate(0 ,-50%)
    transition: transform var(--trans-s), opacity var(--trans-s)
  .icon-search
    transform: translate(0 ,-50%)
    left: 20px
    color: #ccc
  .icon-cancel
    opacity: 0
    right: 5px
    color: var(--gray)
    transform: translate(20px ,-50%)
    padding: 5px
    cursor: pointer
    transition: transform var(--trans-s) .1s, opacity var(--trans-s) .1s
</style>