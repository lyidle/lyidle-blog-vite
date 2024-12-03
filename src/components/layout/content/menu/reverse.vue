<template>
  <context-menu-item
    :content="contentIsReverse ? '交换布局' : '恢复布局'"
    :icon="
      !contentIsReverse
        ? 'i-arcticons:goodwy-gallery'
        : 'i-arcticons:photoprism-gallery'
    "
    @click="contentIsReverse = !contentIsReverse"
  ></context-menu-item>
</template>

<script setup lang="ts" name="ReverseContent">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 初始化仓库中用到的值
const { contentIsReverse } = storeToRefs(useSettingStore())
</script>

<style scoped></style>
