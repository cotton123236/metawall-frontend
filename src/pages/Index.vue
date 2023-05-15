<script setup>
import { onMounted } from "@vue/runtime-core";
import { storeToRefs } from "pinia";
import { useModalStore } from "../stores/modalStore";
import { getMyProfile } from "./../api/fetch";
import { useUserStore } from "./../stores/userStore";
import { useRoute } from "vue-router";
// components
import Header from "./../components/Header.vue";
import Navigation from "./../components/Navigation.vue";
import ModalPost from "./../components/ModalPost.vue";
import ModalCreateChatroom from "./../components/ModalCreateChatroom.vue";
import ModalPay from "./../components/ModalPay.vue";
import ModalPaid from "./../components/ModalPaid.vue";
import ModalLoader from "./../components/ModalLoader.vue";
import ModalFollows from "./../components/ModalFollows.vue";
import ModalLikes from "./../components/ModalLikes.vue";
import ModalDeletePost from "./../components/ModalDeletePost.vue";
import ModalDeleteComment from "./../components/ModalDeleteComment.vue";
import Chatroom from "./../components/Chatroom.vue";

const route = useRoute();
const userStore = useUserStore();
const { patchUser } = userStore;

// 若姓名沒資料，則打 api 取得
onMounted(() => {
  if (!userStore.name) {
    gerProfile();
  }
});
const gerProfile = async () => {
  const { data } = await getMyProfile();
  if (data.status === "success") {
    patchUser({
      _id: data.data._id,
      name: data.data.nickName,
      image: data.data.hasOwnProperty("avatar") ? data.data.avatar : "",
    });
  }
};

// ModalPost control
const modalStore = useModalStore();

const {
  useModalPaid,
  useModalPay,
  useModalPost,
  useModalFollows,
  useModalLikes,
  useModalDeletePost,
  useModalDeleteComment,
  useModelCreateChatroom,
} = storeToRefs(modalStore);
</script>

<template>
  <div class="main-wrapper">
    <!-- header -->
    <Header />
    <!-- main -->
    <main class="space-lr">
      <div class="main-content mw-1200">
        <!-- nav -->
        <div class="nav-wrap">
          <Navigation />
        </div>
        <!-- view -->
        <div class="main-view">
          <router-view :key="route.path"></router-view>
        </div>
      </div>
      <!-- modal -->
      <Transition name="clip">
        <ModalPaid v-if="useModalPaid" />
      </Transition>
      <Transition name="clip">
        <ModalPay v-if="useModalPay" />
      </Transition>
      <Transition name="clip">
        <ModalPost v-if="useModalPost" />
      </Transition>
      <Transition name="clip">
        <ModalFollows v-if="useModalFollows" />
      </Transition>
      <Transition name="clip">
        <ModalLikes v-if="useModalLikes" />
      </Transition>
      <Transition name="clip">
        <ModalDeletePost v-if="useModalDeletePost" />
      </Transition>
      <Transition name="clip">
        <ModalDeleteComment v-if="useModalDeleteComment" />
      </Transition>
      <Transition name="clip">
        <ModalCreateChatroom v-if="useModelCreateChatroom" />
      </Transition>
    </main>
  </div>
  <Chatroom />
</template>

<style lang="sass">
@import ./../assets/sass/base/mixin

// main
main
  padding-top: 85px
  +rwdmax(900)
    padding-bottom: 50px

  .main-content
    display: flex
  .main-view
    flex: 1
    padding-left: 30px
    // padding-right: 20px
    +rwdmax(900)
      padding-left: 0
  .nav-wrap
    width: 350px
    +rwdmax(1200)
      width: 300px
    +rwdmax(900)
      width: 0
    //   display: none
</style>
