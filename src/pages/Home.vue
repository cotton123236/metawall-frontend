<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from './../stores/userStore'
import { usePostStore } from './../stores/postStore'
import { useModalStore } from './../stores/modalStore'
import { getPostsByRoute } from './../api/fetch'
import { appendQuery } from './../utils/utils'
// components
import Posts from './../components/Posts.vue'
import Loader from './../components/Loader.vue'

const route = useRoute()
const userStore = useUserStore()
const modalStore = useModalStore()
const postStore = usePostStore()

const { posts, currentPage, hasNext } = storeToRefs(postStore)
const { patchPosts, pushPosts } = postStore
const { openModalAlert } = modalStore


// post handler
const isLoading = ref(true)

const getAllPosts = async () => {
  isLoading.value = true
  const { data } = await getPostsByRoute(route, currentPage.value)
  // 成功取得
  if (data.status === 'success') {
    patchPosts(data.data.list)
    hasNext.value = data.data.page.has_next
  }
  // 失敗
  else {
    openModalAlert(data.message)
  }
  isLoading.value = false
}

getAllPosts()

// infinite scroll
const loadingDetector = ref(null)
const isAllowScroll = ref(true)

const infiniteLoading = async () => {
  const { top } = loadingDetector.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  if (isAllowScroll.value && top < windowHeight && hasNext.value) {
    isAllowScroll.value = false
    currentPage.value += 1
    const { data } = await getPostsByRoute(route, currentPage.value)
    if (data.status === 'success') {
      pushPosts(data.data.list)
      hasNext.value = data.data.page.has_next
      isAllowScroll.value = true
    }
    else {
      openModalAlert(data.message)
    }
  }
}

const onShowPaidModal = () => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('isPaid')?.startsWith('true')) {
    openModalAlert("支付成功");
  }
}

onMounted(() => {
  window.addEventListener('scroll', infiniteLoading)
  onShowPaidModal();
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', infiniteLoading)
  currentPage.value = 1
  hasNext.value = false
})

</script>

<template>
  <section>
    <!-- post-content -->
    <div class="post-content">
      <div class="is-loading" v-if="isLoading">
        <Loader />
      </div>
      <template v-else-if="posts.length">
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
      <div class="loading-detector" ref="loadingDetector">
        <div class="is-loading" v-if="hasNext">
          <Loader />
        </div>
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