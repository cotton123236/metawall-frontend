<script setup>
import { useRoute } from "vue-router";
// components
import Filter from "./../components/Filter.vue";
import Searcher from "./../components/Searcher.vue";
import UserTools from "./../components/UserTools.vue";
// images
import LogoLarge from "./../assets/image/logo-large.svg";
import Logo from "./../assets/image/logo.svg";

const route = useRoute()

</script>

<template>
  <header class="space-lr">
    <div class="container mw-1200">
      <!-- logo -->
      <router-link class="logo" to="/">
        <picture>
          <source :srcset="LogoLarge" media="(min-width: 768px)" />
          <img :src="Logo" alt="" />
        </picture>
      </router-link>
      <!-- searcher -->
      <Searcher :key="route.path" />
      <div class="tools">
        <Filter :key="route.path" />
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
  background-color: rgba(255, 255, 255, .8)
  backdrop-filter: blur(8px)

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
    +rwdmax(767)
      margin-left: 10px

  .tools
    display: flex
    align-items: center
    margin-left: auto
</style>