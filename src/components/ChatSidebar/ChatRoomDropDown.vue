<script setup>

</script>
<template>
  <div class="more">
        <div class="more-btn">
          <i class="icon-more"></i>
        </div>
        <div class="more-list">
          <ul>
            <li>
              <a>個人檔案</a>
            </li>
            <li>
              <a href="javascript:;" @click="null">編輯貼文</a>
            </li>
            <li>
              <a href="javascript:;" @click="null">刪除貼文</a>
            </li>
          </ul>
        </div>
      </div>
</template>
<style lang="sass" scoped>
  .more
    position: relative
    &:hover
      .more-list
        z-index: 2
        opacity: 1
        pointer-events: auto
        transform: translate(-50%, 0)
    .more-btn
      display: flex
      justify-content: center
      align-items: center
      width: 30px
      height: 30px
      border-radius: 50%
      cursor: pointer
      transition: background-color var(--trans-s)
      &:hover
        background-color: var(--dark-white)
      i
        font-size: 20px
    .more-list
      position: absolute
      top: calc(100% + 8px)
      left: 50%
      transform: translate(-50%, -10px)
      width: 90px
      filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.2))
      opacity: 0
      pointer-events: none
      transition: var(--trans-s)
    ul
      background-color: var(--white)
      overflow: hidden
      border-radius: 5px
      padding: 5px 0
      &::before
        position: absolute
        content: ''
        top: -8px
        left: 50%
        transform: translateX(-50%)
        border-width: 0 8px 8px 8px
        border-style: solid
        border-color: transparent transparent #fff transparent
      a
        display: block
        font-size: px(12)
        line-height: 1.5
        text-align: center
        padding: 5px 10px
        &:hover
          color: var(--primary-blue)
</style>