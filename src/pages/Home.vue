<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { usePostStore } from './../stores/postStore'
import { useModalStore } from './../stores/modalStore'
import { getPostsByRoute } from './../api/fetch'
import { appendQuery } from './../utils/utils'
import Posts from './../components/Posts.vue'

const route = useRoute()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()

const { posts } = storeToRefs(postStore)
const { patchPosts } = postStore

watch(() => modalStore.useModalLikes, async (newVal) => {
  if(!newVal){
    patchPosts([])
    await getAllPosts()
  }
})

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
          data-aos="clip-left"
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