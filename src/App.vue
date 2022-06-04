<script setup>
import { storeToRefs } from "pinia";
import "./assets/sass/style.sass";
import router from "./router/router";
import ModalAlert from "./components/ModalAlert.vue";
// ModalPost control
import { useModalStore } from "./stores/modalStore";
const modalStore = useModalStore();

const { useModalAlert } = storeToRefs(modalStore);

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
  <Transition name="clip">
    <ModalAlert v-if="useModalAlert" />
  </Transition>
  <router-view></router-view>
</template>

<style>
</style>
