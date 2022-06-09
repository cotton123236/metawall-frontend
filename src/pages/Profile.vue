<script setup>
import { watch } from 'vue'
import { ref, reactive, onMounted } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from './../stores/postStore'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { getProfileById, getPostsByIdAndRoute, getMyProfile } from './../api/fetch'
import { useDateFormat } from './../utils/utils'
import { 
  getFollowList,
  postFollowByperson,
  deleteFollowByperson 
} from '../api/fetch'
// components
import Posts from './../components/Posts.vue'

const route = useRoute()
const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()

const { patchUser } = userStore;
const { profilePosts } = storeToRefs(postStore)
const { patchProfilePosts } = postStore

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
  const { data } = await getPostsByIdAndRoute(id, route)
  if (data.status !== 'success') return;
  isLoading.value = false
  patchProfilePosts(data.data.list)
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

watch(() => modalStore.useModalPost, async (newVal) => {
  if(!newVal){
    await getProfilePosts()
  }
})


// 追蹤 & 取消追蹤
const whetherToFollow = async () => {
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
}

</script>

<template>
  <section>
    <!-- profile -->
    <div class="profile" data-aos="clip-left" data-aos-duration="1000">
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
        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
          <path opacity="0.2" fill="#ef9c9a" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
          <path opacity="0.6" fill="#ef9c9a" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z">
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/>
          </path>
        </svg>
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
    border-radius: 0 60px 0 60px

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