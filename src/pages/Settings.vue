<script setup>
import { useUserStore } from '../stores/userStore'


const userStore = useUserStore()

</script>

<template>
  <section>
    <div class="headshot-wrap">
      <label class="headshot">
        <input type="file">
        <img :src="userStore.image" alt="">
      </label>
      <i class="icon-plus"></i>
    </div>
    <div class="content">

    </div>
  </section>
</template>

<style lang="sass" scoped>
@import ./../assets/sass/base/mixin

.headshot-wrap
  position: relative
  z-index: 2
  width: 140px
  height: 140px
  margin: 0 auto -70px
  border-radius: 50%
  border: 10px solid var(--background)
  background-color: var(--background)
  .headshot
    position: relative
    box-shadow: 0 0 10px rgba(0, 0, 0, .3)
    cursor: pointer
    &:hover
      & + i
        opacity: .9
      &::before
        opacity: 1
    &::before
      background-color: rgba(0, 0, 0, .3)
      opacity: 0
      transition: opacity var(--trans-s)
      +posFill
      +pseudo
    input
      display: none
  i
    display: flex
    justify-content: center
    align-items: center
    position: absolute
    bottom: 7px
    right: 7px
    width: 20px
    height: 20px
    border-radius: 50%
    color: var(--white)
    background-color: var(--primary-pink)
    opacity: 0
    transition: opacity var(--trans-s)

.content
  position: relative
  z-index: 1
  padding: 60px 40px
  background-color: var(--white)
  border-radius: 20px
  box-shadow: 0 0 10px rgba(0, 0, 0, .1)
</style>