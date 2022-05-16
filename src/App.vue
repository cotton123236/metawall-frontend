<script setup>
import './assets/sass/style.sass'
import { inject } from 'vue-demi'
import { storeToRefs } from 'pinia'
import { useStore } from './stores/stores'

const { VITE_API_URL } = import.meta.env
const store = useStore()
const axios = inject('axios')

const { user } = storeToRefs(store)
const { getUser } = store

const url = `${VITE_API_URL}/api/users`
const userId = '626e91ea36674e3b1cdd704b'

// get user and save
getUser(url, userId)

</script>

<template>
  <router-view></router-view>
</template>

<style>

</style>
