<script setup>
import './assets/sass/style.sass'
import { useUserStore } from './stores/userStore'
import { fetchUser } from './api/fetch'

const userStore = useUserStore()

const { patchUser } = userStore

const userId = '626e91ea36674e3b1cdd704b'

fetchUser(userId).then(res => {
  patchUser(res.data)
})

</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>
