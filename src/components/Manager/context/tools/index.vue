<template>
  <div class="manager-tools">
    <i
      class="w-1em h-1em cur-pointer"
      :class="isFold ? icons.fold : icons.expand"
      @click="isFold = !isFold"
    ></i>
    <div>tools</div>
  </div>
</template>

<script setup lang="ts" name="ManagerTools">
// 引入 icon
import { icons } from "./icon"
// 引入 仓库
import { useManagerStore } from "@/store/manager"
// 提取变量
const { isFold } = storeToRefs(useManagerStore())
</script>
<style scoped lang="scss">
$gap: 10px;
.manager-tools {
  width: 100%;
  height: $manager-context-tools-height;
  background-color: yellow;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: $gap;
  padding-left: $gap;
  position: relative;
  z-index: $manager-tools-index;
}
</style>
