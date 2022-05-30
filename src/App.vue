<script setup>
import './assets/sass/style.sass'
import router from './router/router'
// import { useUserStore } from './stores/userStore'
// import { getProfileById } from './api/fetch'

// const userStore = useUserStore()

// const { patchUser } = userStore

// const userId = '626e91ea36674e3b1cdd704b'

// getProfileById(userId).then(res => {
//   patchUser(res.data)
// })

</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>
