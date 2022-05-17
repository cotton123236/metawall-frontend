<script setup>
import './assets/sass/style.sass'
import { useUserStore } from './stores/userStore'
import { fetchUser } from './api/fetch'

const { VITE_API_URL } = import.meta.env
const userStore = useUserStore()

const { patchUser } = userStore

const url = `${VITE_API_URL}/api/users`
const userId = '626e91ea36674e3b1cdd704b'

fetchUser(url, userId).then(res => {
  patchUser(res.data)
})

</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>
