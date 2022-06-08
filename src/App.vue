<script setup>
import "./assets/sass/style.sass";
import { storeToRefs } from "pinia";
import router from "./router/router";
import ModalAlert from "./components/ModalAlert.vue";
import ModalLoader from "./components/ModalLoader.vue";
// ModalPost control
import { useModalStore } from "./stores/modalStore";
import loginBg from "./assets/image/login-bg.png";

const modalStore = useModalStore();

const { useModalAlertText } = storeToRefs(modalStore)
const { useModalAlert, useModalLoader } = storeToRefs(modalStore);
</script>

<template>
  <div class="app-wrapper">
    <div class="app-bg"></div>
    <router-view></router-view>
    <Transition name="fade">
      <ModalLoader v-if="useModalLoader" />
    </Transition>
    <Transition name="clip">
      <ModalAlert v-if="useModalAlert" />
    </Transition>
  </div>
</template>

<style>
</style>
