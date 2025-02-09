<template>
  <template v-if="asideCounts">
    <my-context-menu-item
      :content="`${isAside ? '打开' : '关闭'}侧边信息`"
      :icon="
        !isAside
          ? 'i-arcticons:goodwy-gallery'
          : 'i-arcticons:photoprism-gallery'
      "
      @click="isAside = !isAside"
    ></my-context-menu-item>
  </template>
</template>

<script setup lang="ts" name="AsideCardMenu">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 初始化仓库中用到的值
const { isAside, asideCounts } = storeToRefs(useSettingStore())
</script>

<style scoped></style>
