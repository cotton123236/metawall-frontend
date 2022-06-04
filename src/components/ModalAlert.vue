<script setup>
import { storeToRefs } from "pinia";
import { useModalStore } from "./../stores/modalStore";
const modalStore = useModalStore();

const { useModalAlert, useModalAlertText } = storeToRefs(modalStore);

// 3秒後消失
setTimeout(() => {
  useModalAlert.value = false;
  useModalAlertText.value = "";
}, 3000);
</script>

<template>
  <div>
    <span>{{ useModalAlertText }}</span>
  </div>
</template>

<style lang="sass" scoped>
div
  background: rgba(255,255,255,.3)
  position: fixed
  padding: 5px 20px
  border-radius: 5px
  right: 20px
  top: 20px
  z-index: 999
</style>