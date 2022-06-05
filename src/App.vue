<script setup>
import "./assets/sass/style.sass";
import { storeToRefs } from "pinia";
import router from "./router/router";
import ModalAlert from "./components/ModalAlert.vue";
import ModalLoader from "./components/ModalLoader.vue";
// ModalPost control
import { useModalStore } from "./stores/modalStore";

const modalStore = useModalStore();

const { useModalAlert, useModalLoader } = storeToRefs(modalStore);
</script>

<template>
  <router-view></router-view>
  <Transition name="clip">
    <ModalAlert v-if="useModalAlert" />
  </Transition>
  <Transition name="fade">
    <ModalLoader v-if="useModalLoader" />
  </Transition>
</template>

<style>
</style>
