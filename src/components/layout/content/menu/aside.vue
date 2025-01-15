<template>
  <context-menu-item
    :content="isAside ? '关闭侧边信息' : '打开侧边信息'"
    :icon="
      !isAside ? 'i-arcticons:goodwy-gallery' : 'i-arcticons:photoprism-gallery'
    "
    @click="isAside = !isAside"
    v-if="!docMenuIsFixedLazy"
  ></context-menu-item>
</template>

<script setup lang="ts" name="AsideCardMenu">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 初始化仓库中用到的值
const { isAside, docMenuIsFixedLazy } = storeToRefs(useSettingStore())
</script>

<style scoped></style>
