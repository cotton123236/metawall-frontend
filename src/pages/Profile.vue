<script setup>
import { ref, reactive } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from './../stores/postStore'
import { useUserStore } from './../stores/userStore'
import { getProfileById, getPostsById, getMyProfile } from './../api/fetch'
import Posts from './../components/Posts.vue'
import { 
  getFollowList,
  postFollowByperson,
  deleteFollowByperson 
} from '../api/fetch'

const userStore = useUserStore()
const route = useRoute()

const { patchUser } = userStore;

// test
const isFollowing = ref(false)
if (!userStore._id) {
  async () => {
    const { data } = await getMyProfile();
    if (data.status === "success") {
      patchUser({
        _id: data.data._id,
        name: data.data.nickName,
        image: data.data.hasOwnProperty("avatar")
          ? data.data.avatar
          : "../assets/image/logo.png",
      });
    }
  }
}

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
  console.log(data)
  if (data.status !== 'success') return;
  Object.assign(profileUser, data.data)
}

getProfileUser()

// 取得 profile 貼文
const profilePost = reactive([])
const getProfilePost = async () => {
  const { data } = await getPostsById(id)
  console.log(data)
  if (data.status !== 'success') return;
  Object.assign(profilePost, data.data.list)
}

getProfilePost()

// 判斷否有追蹤
const checkIsLike = async () => {
  const checkFollows = []
  if (!userStore._id) return
  const { data } =  await getFollowList(userStore._id);
  if (data.status !== 'success') return
  if (data.data.length === 0 )return
  for (let list of data.data.list) {
    checkFollows.push(list.following[0]._id)
    if (checkFollows.findIndex(item => item == id) >= 0) {
      isFollowing.value = true
    }
  }
  patchUser({
    follows: data.data.list
  })
}

checkIsLike()

// 追蹤
const whetherToFollow = async () => {
  if (id === userStore._id) return
  if (isFollowing.value) {
    const { data } = await deleteFollowByperson(id);
    if (data.status !== 'success') return;
    isFollowing.value = false;
  } else {
    const { data } = await postFollowByperson(id)
    console.log('data', data);
    if (data.status !== 'success') return;
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
        <div class="created">2022/04/04 加入元宇宙</div>
        <div class="detail">
          <span>{{profilePost.length}} 則貼文</span>
          <span>5 人追蹤中</span>
        </div>
      </div>
    </div>
    <!-- post-content -->
    <div class="post-content">
      <template v-if="profilePost.length">
        <Posts
          v-for="post in profilePost"
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