<script setup>
  import { useDateFormat } from '../utils/utils'

  const props = defineProps({
    comment: Object
  })
</script>

<template>
  <div class="each-comment">
    <div class="headshot">
      <img v-if="comment.editor.avatar" :src="comment.editor.avatar" alt="user-photo">
    </div>
    <div class="content">
      <span class="name">{{comment.editor.nickName}}</span>
      <span class="date">{{useDateFormat(comment.createdAt)}}</span>
      <p>{{comment.comment}}</p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

.each-comment
  display: flex
  align-items: flex-start
  .headshot
    flex-shrink: 0
    width: 40px
    height: 40px
  .content
    width: 100%
    .name
      font-family: $code-font
      font-size: px(14)
      line-height: 1.5
    .date
      color: #ccc
      font-size: px(12)
      font-weight: 300
      line-height: 1.5
      margin-left: 20px
    p
      font-size: px(14)
      line-height: 1.5
      color: var(--gray)
      margin-top: 3px
</style>
