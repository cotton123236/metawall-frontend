<script setup>
import { ref } from 'vue-demi'
import { useRoute } from 'vue-router'
import { useDateFormat } from '../utils/utils'
import { useUserStore } from './../stores/userStore'
import { useModalStore } from './../stores/modalStore'
import { usePostStore } from '../stores/postStore'
import { updateComment } from '../api/fetch'
// components
import contenteditable from 'vue-contenteditable'

const props = defineProps({
  comment: Object,
  postId: String
})

const route = useRoute()
const userStore = useUserStore()
const postStore = usePostStore()
const modalStore = useModalStore()
const { openModalDeleteComment, openModalAlert, closeModalLoader } = modalStore
const { patchPostComment, patchProfilePostComment } = postStore

// 紀錄 comment
let content = props.comment.comment

// 編輯留言
const isEditing = ref(false)

const editCommentHandler = () => {
  isEditing.value = !isEditing.value
  if (isEditing) {
    props.comment.comment = content
  }
}

const patchComment = async() => {
  const isProfile = route.params.id ? true : false
  const potIdAndCommentId = `${props.postId}/${props.comment._id}`
  const { data } = await updateComment(potIdAndCommentId,
  props.comment.comment)
  if (!props.comment.comment || props.comment.comment.trim().length === 0 ) return
  if (data.status === 'success') {
    isProfile ? 
    patchProfilePostComment(potIdAndCommentId, data.data.comment) : 
    patchPostComment(potIdAndCommentId, data.data.comment)
    content = props.comment.comment
  } else {
    openModalAlert(data.message)
  }
  
  isEditing.value = false
  closeModalLoader()  
}

// 刪除留言
const deleteCommentHandler = (comment) => {
  const { _id } = comment
  openModalDeleteComment(`${props.postId}/${_id}`)
}

</script>

<template>
  <div class="each-comment">
    <router-link :to="comment.editor._id" class="headshot">
      <img v-if="comment.editor.avatar" :src="comment.editor.avatar" alt="user-photo">
    </router-link>
    <div class="content">
      <div class="head">
        <router-link :to="comment.editor._id" class="name">{{ comment.editor.nickName }}</router-link>
        <span class="date">{{ useDateFormat(comment.createdAt) }}</span>
        <span
          class="edit-btn"
          v-if="userStore._id === comment.editor._id"
          @click="editCommentHandler"
        >
          {{ isEditing ? '取消' : '編輯' }}
        </span>
        <span
          class="delete-btn"
          v-if="userStore._id === comment.editor._id"
          @click="deleteCommentHandler(comment)"
        >
          刪除
        </span>
      </div>
      <div class="textarea">
        <contenteditable tag="p" :contenteditable="isEditing" v-model="comment.comment"/>
        <div
          v-if="isEditing"
          class="submit-btn"
          :class="{disable: !comment.comment || comment.comment.trim().length === 0}"
          @click="patchComment"
        >
          發佈
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

.each-comment
  display: flex
  align-items: flex-start
  &:hover
    .content
      .edit-btn, .delete-btn
        opacity: .4
  .headshot
    position: relative
    z-index: 1
    flex-shrink: 0
    width: 40px
    height: 40px
    &:hover
      img
        transform: scale(1.1)
    img
      position: relative
      z-index: -1
      transition: transform var(--trans-m)
  .content
    width: 100%
    .head
      display: flex
      align-items: center
      padding-right: 10px
    .name
      font-family: $code-font
      font-size: px(14)
      line-height: 1.5
      transition: color var(--trans-s)
      &:hover
        color: var(--primary-pink)
    .date
      color: #ccc
      font-size: px(12)
      font-weight: 300
      line-height: 1.5
      margin-left: 20px
    .edit-btn, .delete-btn
      display: inline-block
      color: var(--primary-blue-light)
      font-size: px(12)
      line-height: 1.5
      cursor: pointer
      opacity: 0
      transition: var(--trans-s)
      &:hover
        opacity: .8
    .edit-btn
      color: var(--primary-blue-light)
      margin-left: auto
    .delete-btn
      color: var(--gray)
      margin-left: 10px
    .textarea
      position: relative
      p
        font-size: px(14)
        font-weight: 300
        line-height: 1.5
        color: var(--gray)
        margin-top: 3px
        width: 100%
        &[contenteditable="true"]
          background-color: var(--background)
          border-radius: 20px
          padding: 5px 40px 5px 20px
      .submit-btn
        position: absolute
        bottom: 4px
        right: 15px
        font-size: px(12)
        padding: 5px
        cursor: pointer
        color: var(--primary-blue-light)
        opacity: .7
        transition: opacity var(--trans-s)
        &:hover
          opacity: 1
        &.disable
          opacity: .2
          cursor: default
          pointer-events: none
</style>
