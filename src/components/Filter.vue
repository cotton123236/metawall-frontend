<script setup>
import { ref, onMounted } from '@vue/runtime-core'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useFilterStore } from '../stores/filterStores'
import { appendQuery } from '../utils/utils'
import { getPostByRoute } from './../api/fetch'
import { usePostStore } from './../stores/postStore'


const route = useRoute()
const filterStore = useFilterStore()
const postStore = usePostStore()

// open and close control
const filterActive = ref(false)

const activeControl = () => {
  filterActive.value = !filterActive.value
}

onMounted(() => {
  document.body.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter') && !e.target.closest('.filter')) {
      filterActive.value = false
    }
  })
})

// change selected control
const { filters: datalist } = storeToRefs(filterStore)
const { patchPosts } = postStore
const selectedIndex = ref(datalist.value.findIndex(item => item.sort === route.query.sort))

const changeSelected = async (li, index) => {
  if (index === selectedIndex.value) return;
  const { sort } = li
  selectedIndex.value = index
  // push query
  await appendQuery(route, { sort })
  // then get data
  const { data } = await getPostByRoute(route)
  if (data.data.status !== 'success') return;
  patchPosts(data.data.list)
}

</script>


<template>
  <div class="filter" :class="{ active: filterActive }" @click="activeControl">
    <div class="selected">
      <div class="inner">
        <i class="icon-filter"></i>
      </div>
    </div>
    <div class="datalist">
      <ul>
        <li
          v-for="(li, index) in datalist"
          :key="li.name"
          :class="{ active: index === selectedIndex }"
          @click="changeSelected(li, index)"
        >
          {{ li.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="sass">
@import ./../assets/sass/base/mixin

// filter
.filter
  position: relative
  font-size: px(14)
  &.active
    .datalist
      opacity: 1
      transform: translate(-50%, 0)
      pointer-events: auto

  .selected
    display: flex
    justify-content: space-between
    align-items: center
    width: 30px
    height: 30px
    font-size: px(14)
    letter-spacing: .02em
    font-weight: 300
    color: var(--dark-gray)
    margin: 0 20px
    background-color: #fff
    cursor: pointer
    transition: box-shadow var(--trans-m)
    .inner
      width: 100%
      height: 100%
      display: flex
      align-items: center
      justify-content: center
    .icon-filter
      font-size: 18px
  .datalist
    position: absolute
    z-index: 2
    top: calc(100% + 15px)
    left: 50%
    width: 150px
    opacity: 0
    transform: translate(-50%, -20px)
    pointer-events: none
    transition: opacity var(--trans-m), transform var(--trans-m), box-shadow var(--trans-m)
    filter: drop-shadow(5px 5px 8px rgba(0, 0, 0, .2))
    &::before
      position: absolute
      content: ''
      top: -10px
      left: 50%
      transform: translateX(-50%)
      border-width: 0 10px 10px 10px
      border-style: solid
      border-color: transparent transparent #fff transparent
    ul
      padding: 5px 0
      border-top: none
      border-radius: 10px
      background-color: #fff
      overflow: hidden
    li
      font-size: px(14)
      font-weight: 300
      letter-spacing: .02em
      color: var(--dark-gray)
      padding: 12px 20px
      cursor: pointer
      transition: background-color var(--trans-m)
      &:hover
        background-color: var(--dark-white)
      &.active
        background-color: var(--dark-white)

</style>