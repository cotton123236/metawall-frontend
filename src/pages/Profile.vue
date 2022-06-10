<script setup>
import { watch } from 'vue'
import { ref, reactive, onMounted, onBeforeUnmount } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from './../stores/postStore'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { getProfileById, getPostsByIdAndRoute, getMyProfile } from './../api/fetch'
import { useDateFormat } from './../utils/utils'
import { debounce } from 'lodash-es'
import { 
  getFollowList,
  postFollowByperson,
  deleteFollowByperson
} from '../api/fetch'
// components
import Posts from './../components/Posts.vue'
import Loader from './../components/Loader.vue'

const route = useRoute()
const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()

const { patchUser } = userStore;
const { profilePosts, currentPage, hasNext } = storeToRefs(postStore)
const { pushProfilePosts, patchProfilePosts } = postStore
const { openModalAlert } = modalStore

profilePosts.value.length = 0

// test
const isFollowing = ref(false)

const gerProfile = async () => {
  const { data } = await getMyProfile();
  if (data.status === "success") {
    patchUser({
      _id: data.data._id,
      name: data.data.nickName,
      image: data.data.hasOwnProperty("avatar") ? data.data.avatar : "",
    });
  }
};

const { id } = route.params

// 取得 profile 使用者
const profileUser = reactive({
  _id: '',
  nickName: '',
  avatar: '',
  follows: [],
  likes: []
})

const getProfileUser = async () => {
  const { data } = await getProfileById(id)
  if (data.status !== 'success') return;
  Object.assign(profileUser, data.data)
}

getProfileUser()

// 取得 profile 貼文
const isLoading = ref(true)

const getProfilePosts = async () => {
  isLoading.value = true
  const { data } = await getPostsByIdAndRoute(id, route, currentPage.value)
  // 成功取得
  if (data.status === 'success') {
    patchProfilePosts(data.data.list)
    hasNext.value = data.data.page.has_next
  }
  // 失敗
  else {
    openModalAlert(data.message)
  }
  isLoading.value = false
}

getProfilePosts()

// 判斷否有追蹤
const checkFollows = ref([])
const checkIsFollow = async () => {
  if (userStore._id)  {
    checkFollows.value = []
    const { data } =  await getFollowList(userStore._id);
    if (data.status !== 'success') return
    patchUser({
      follows: data.data.list
    })  
    for (let follow of userStore.follows) {
      checkFollows.value.push(follow.following[0]._id)
    }
    checkFollows.value.findIndex(item => item === id) >= 0 
    ? isFollowing.value = true : isFollowing.value = false
  }
}

checkIsFollow()

onMounted(async () => {
  if (!userStore._id) {
    await gerProfile()
    await checkIsFollow()
  }
});

// 追蹤幾個人
const FollowNum = ref(0)
const getFollow = async () => {
  const { data } = await getFollowList(id)
  if (data.status === 'success') {
    FollowNum.value = data.data.list.length
  }
}
getFollow()

watch(() => modalStore.useModalFollows, async (newVal) => {
  if(!newVal){
    await getFollow()
    await checkIsFollow()
  }
})

watch(() => [modalStore.useModalPost, profilePosts], async (newVal) => {
  if(!newVal){
    await getProfilePosts()
  }
})

// 追蹤 & 取消追蹤
const whetherToFollow = debounce(async () => {
  if (id === userStore._id) return
  if (isFollowing.value) {
    const { data } = await deleteFollowByperson(id);
    if (data.status !== 'success') return;
    const index = checkFollows.value.findIndex(item => item == id)
    if(index >=0 ){
      checkFollows.value.splice(index, 1)
      isFollowing.value = false;
    }
  } else {
    const { data } = await postFollowByperson(id)
    if (data.status !== 'success') return;
    checkFollows.value.splice(0, 0, id)
    isFollowing.value = true;
  }
}, 150)
// infinite scroll
const loadingDetector = ref(null)
const isAllowScroll = ref(true)

const infiniteLoading = async () => {
  const { top } = loadingDetector.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  if (isAllowScroll.value && top < windowHeight && hasNext.value) {
    isAllowScroll.value = false
    currentPage.value += 1
    const { data } = await getPostsByIdAndRoute(id, route, currentPage.value)
    if (data.status === 'success') {
      pushProfilePosts(data.data.list)
      hasNext.value = data.data.page.has_next
      isAllowScroll.value = true
    }
    else {
      openModalAlert(data.message)
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', infiniteLoading)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', infiniteLoading)
  currentPage.value = 1
  hasNext.value = false
})

</script>

<template>
  <section>
    <!-- profile -->
    <div class="profile" data-aos="clip-left" data-aos-duration="1000" v-if="profileUser._id">
      <div class="headshot">
        <img v-if="profileUser.avatar" :src="profileUser.avatar" alt="">
      </div>
      <div class="content">
        <div class="head">
          <span class="name">{{ profileUser.nickName }}</span>
          <template v-if="userStore._id !== id">
            <div
              class="follow-btn"
              :class="isFollowing ? 'unfollow' : 'follow'"
              @click="whetherToFollow"
            >
              {{ isFollowing ? '取消追蹤' : '追蹤' }}
            </div>
          </template>
        </div>
        <div class="created">{{ useDateFormat(profileUser.createdAt) }} 加入元宇宙</div>
        <div class="detail">
          <span>{{ profilePosts.length }} 則貼文</span>
          <span>{{ FollowNum }} 人追蹤中</span>
        </div>
      </div>
    </div>
    <!-- post-content -->
    <div class="post-content">
      <div class="is-loading" v-if="isLoading">
        <Loader />
      </div>
      <template v-else-if="profilePosts.length">
        <Posts
          v-for="post in profilePosts"
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
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

// profile
.profile
  position: relative
  display: flex
  padding: 50px 40px
  border-radius: 10px 100px 10px 100px
  background-color: var(--white)
  box-shadow: 0 0 10px rgba(0, 0, 0, .1)
  +rwdmax(767)
    display: block
    padding: 40px 30px
    border-radius: 8px 60px 8px 60px
  
  .headshot
    width: 130px
    height: 130px
    background-color: #f5f5f5
    box-shadow: 0 0 15px rgba(0, 0, 0, .3)
    +rwdmax(767)
      width: 100px
      height: 100px

  .content
    flex: 1
    font-family: $code-font
    padding-top: 10px
    padding-left: 40px
    padding-right: 20px
    +rwdmax(767)
      padding-left: 0
      padding-right: 0
      padding-top: 30px
    .head
      display: flex
      align-items: center
      justify-content: space-between
    .name
      font-size: px(24)
      font-weight: 500
      color: var(--primary-pink)
      +rwdmax(1024)
        font-size: px(20)
    .follow-btn
      display: inline-block
      font-size: px(12)
      padding: 8px 16px
      margin-left: 20px
      border-radius: 20px
      box-shadow: 0 0 10px rgba(0, 0, 0, .2)
      cursor: pointer
      +rwdmax(767)
        margin-left: 0
      &.follow
        background-image: linear-gradient(to bottom, var(--primary-blue), #010f18)
        color: var(--white)
      &.unfollow
        background-color: var(--light-gray)
        color: var(--white)
    .created
      font-size: px(12)
      font-weight: 300
      line-height: 1.5
      color: var(--light-gray)
      margin-top: 30px
    .detail
      line-height: 1.5
      margin-top: 10px
      span
        font-size: px(14)
        & + span
          margin-left: 50px

.post-content
  margin-top: 20px
  padding-bottom: 20px
  .no-post
    padding: 60px 30px

</style>