<template>
  <ul class="topnav">
    <layout-header-normal>
      <template #scend>
        <my-menu-instance
          v-for="item in userMenuList"
          :data="item"
        ></my-menu-instance>
      </template>
      <template #last> </template>
    </layout-header-normal>
  </ul>
</template>

<script setup lang="ts" name="TopNav">
// 引入store
import { useUserStore } from "@/store/user"

const { userMenuList } = storeToRefs(useUserStore())
</script>

<style scoped lang="scss">
.topnav {
  display: flex;
  height: 100%;
  @include media(sm) {
    display: none;
  }
}
</style>
