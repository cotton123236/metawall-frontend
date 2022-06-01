<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from './../stores/postStore'
import { getPostsByRoute } from './../api/fetch'
import { appendQuery } from './../utils/utils'
import Posts from './../components/Posts.vue'


const route = useRoute()
const postStore = usePostStore()

const { posts } = storeToRefs(postStore)
const { patchPosts } = postStore


// post handler
const getAllPosts = async () => {
  const { data } = await getPostsByRoute(route)
  if (data.status !== 'success') return;
  patchPosts(data.data.list)
}
getAllPosts()

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

<style lang="sass" scoped>
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

</style>