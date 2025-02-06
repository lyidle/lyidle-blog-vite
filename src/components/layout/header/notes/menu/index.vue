<template>
  <my-menu-item :style="menuStyle" class="custom-menu-trigger">
    <a class="topnav-menu-item" :style="{ width: noteWidth }">
      <i class="i-iconoir:page-star w-1em h-1em"></i>
      <span>{{ name }}</span>
    </a>
    <my-menu
      :triangle="true"
      left="calc(-100% - 10px)"
      :top="`${tagsTriangleTop}px`"
      class="childrenMenu"
    >
      <my-menu-item :style="menuStyle" v-for="item in data" :key="item">
        <a class="topnav-menu-item" :style="{ width: noteWidth }">
          <i class="i-iconoir:page-star w-1em h-1em"></i>
          <span>{{ item }}</span>
        </a>
      </my-menu-item>
    </my-menu>
  </my-menu-item>
</template>

<script setup lang="ts" name="HeaderNoteMenu">
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"
// 接收props
defineProps<{ menuStyle?: menuStyleType; data: string[]; name: string }>()

// 笔记
const noteWidth = "90px"
// 分类下 的 标签 menu的 三角位置
const tagsTriangleTop = -20
</script>

<style scoped lang="scss">
$icon-mr: var(--header-topmenu-icon-mr);
.childrenMenu {
  ::v-deep(.title) {
    position: absolute;
    right: -19px;
    top: calc(v-bind(tagsTriangleTop) * -1px + 5px);
    transform: rotateZ(90deg);
  }
}
</style>
