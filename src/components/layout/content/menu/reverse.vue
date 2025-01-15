<template>
  <context-menu-item
    :content="contentIsReverse ? '恢复布局' : '交换布局'"
    :icon="
      !contentIsReverse
        ? 'i-arcticons:photoprism-gallery'
        : 'i-arcticons:goodwy-gallery'
    "
    @click="contentIsReverse = !contentIsReverse"
    v-if="!docMenuIsFixedLazy"
  ></context-menu-item>
</template>

<script setup lang="ts" name="ReverseContent">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 初始化仓库中用到的值
const { contentIsReverse, docMenuIsFixedLazy } = storeToRefs(useSettingStore())
</script>

<style scoped></style>
