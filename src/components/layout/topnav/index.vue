<template>
  <ul class="topnav">
    <li v-for="item in menuList" :key="item.id">
      <router-link :to="item.to">
        <el-icon :class="item.icon"></el-icon>
        {{ item.title }}
      </router-link>
      <Menu :data="item.data" v-if="item.data"></Menu>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps(["menuList", "headerColor"])
// const headerColor = defineModel("headerColor")
</script>

<style scoped lang="scss">
.topnav {
  @media screen and (max-width: $scr-sm) {
    display: none;
  }
  display: flex;
  > li {
    margin-left: var(--header-topnav-margin);
    position: relative;
    > a {
      color: v-bind(headerColor);
      @include flex-center(space-between);
      position: relative;
      > i {
        margin-right: 3px;
      }
    }
    &::before {
      content: "";
      display: block;
      width: 0;
      height: var(--header-topnav-mask-height);
      background-color: var(--header-topnav-mask-color);
      position: absolute;
      bottom: -5px;
      transition: 0.3s;
    }
    &:hover:before {
      width: 100%;
    }
    // 菜单
    &:hover .custom-menu {
      opacity: 1;
    }
  }
}
</style>
