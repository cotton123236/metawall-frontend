<script setup>
import { reactive } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import Filter from "./../components/Filter.vue";
import Searcher from "./../components/Searcher.vue";
import UserTools from "./../components/UserTools.vue";
import LogoLarge from "./../assets/image/logo-large.svg";
</script>

<template>
  <header class="space-lr">
    <div class="container mw-1200">
      <!-- logo -->
      <router-link class="logo" to="/">
        <img :src="LogoLarge" alt="" />
      </router-link>
      <!-- searcher -->
      <Searcher />
      <div class="tools">
        <Filter />
        <UserTools />
      </div>
    </div>
  </header>
</template>

<style lang="sass">
@import ./../assets/sass/base/variables
@import ./../assets/sass/base/mixin

header
  position: fixed
  z-index: 9
  top: 0
  left: 0
  width: 100%
  padding-top: 10px
  padding-bottom: 10px
  box-shadow: 0 0 15px rgba(0, 0, 0, .2)
  background-color: #fff

  .container
    display: flex
    // justify-content: space-between
    align-items: center

  .logo
    font-family: $title-font
    img
      height: 45px

  .searcher
    margin-left: 20px

  .tools
    display: flex
    align-items: center
    margin-left: auto
</style>