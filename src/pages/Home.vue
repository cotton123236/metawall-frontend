<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStore } from './../stores/stores'
import Posts from './../components/Posts.vue'


const { VITE_API_URL } = import.meta.env
const route = useRoute()
const store = useStore()

const { posts } = storeToRefs(store)
const { getPosts } = store

const postUrl = `${VITE_API_URL}/api/posts`


// post handler
getPosts(route, postUrl)

</script>

<template>
  <section>
    <!-- post-content -->
    <div class="post-content">
      <template v-if="posts.length">
        <Posts
          v-for="post in posts"
          :key="post._id"
          :post="post"
        />
      </template>
      <div class="no-post" v-else>
        目前尚無動態，試著新增一則動態吧！
      </div>
    </div>
  </section>
</template>

<style lang="sass">
@import ./../assets/sass/base/mixin

// post-tools
.post-tools
  display: flex
  +rwdmax(500)
    flex-direction: column
  .filter
    +rwdmax(500)
      margin-top: 5px

.post-content
  padding-bottom: 40px
  .no-post
    font-size: px(14)
    text-align: center
    color: var(--light-gray)
    border-radius: 8px
    border: 1px solid var(--dark-white)
    background-color: #fff
    padding: 80px 30px
    margin-top: 20px

</style>