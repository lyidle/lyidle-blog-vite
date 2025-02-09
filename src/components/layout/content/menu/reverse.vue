<template>
  <template v-if="asideCounts">
    <my-context-menu-item
      :content="`${contentIsReverse ? '右侧' : '左侧'}侧边信息`"
      :icon="
        !contentIsReverse
          ? 'i-arcticons:photoprism-gallery'
          : 'i-arcticons:goodwy-gallery'
      "
      @click="contentIsReverse = !contentIsReverse"
    ></my-context-menu-item>
  </template>
</template>

<script setup lang="ts" name="ReverseContent">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 初始化仓库中用到的值
const { contentIsReverse, asideCounts } = storeToRefs(useSettingStore())
</script>

<style scoped></style>
