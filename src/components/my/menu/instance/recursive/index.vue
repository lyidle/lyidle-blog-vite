<template>
  <my-menu
    :triangle="true"
    :top="`${tagsTriangleTop}px`"
    :triangleAttrs="{
      style: {
        ...triangleDirection(
          authWidth,
          directionCallback(cloudDirection || direction)
        ),
        top:
          children.length === 1
            ? `calc(${
                triangleDirection(
                  authWidth,
                  directionCallback(cloudDirection || direction)
                ).top
              } - 0.625rem)`
            : triangleDirection(
                authWidth,
                directionCallback(cloudDirection || direction)
              ).top,
      },
    }"
    :style="{
      ...flowMenuContainerLeft(
        authWidth,
        directionCallback(cloudDirection || direction)
      ),
    }"
    class="sub-menu"
  >
    <my-menu-item
      v-for="sub in children"
      :key="sub"
      class="custom-menu-trigger"
    >
      <my-anchor
        :to="sub.to"
        class="custom-menu-item"
        :style="{ width: authWidth }"
      >
        <icon-parse :icon="sub.icon"></icon-parse>
        <span class="text-nowrap">{{ sub.name }}</span>
        <i
          v-if="sub.children?.length"
          class="i-weui:arrow-outlined toggle"
          :style="`${
            directionCallback(sub.layout?.topnavDirection || direction) ===
            'left'
              ? 'left:0'
              : 'right:0'
          };--toggle-dir:${
            directionCallback(sub.layout?.topnavDirection || direction) ===
            'left'
              ? '-1'
              : '1'
          }`"
        >
        </i>
      </my-anchor>
      <!-- menuMathMax 禁止小于最小的值 itemWidth 且需要取最大值 -->
      <MyMenuInstanceRecursive
        v-if="sub.children?.length"
        v-bind="{
          ...props,
          children: sub.children,
          cloudDirection: directionCallback(
            sub.layout?.topnavDirection || direction
          ),
          authWidth: menuMathMax(handlerMaxWidth(sub), itemWidth),
        }"
        class="sub-menu"
      ></MyMenuInstanceRecursive>
    </my-menu-item>
  </my-menu>
</template>

<script setup lang="ts" name="MyMenuInstanceRecursive">
import { MenuData, directionType } from "../types"
// 引入 辅助函数
import {
  flowMenuContainerLeft,
  triangleDirection,
  directionCallback,
  menuMathMax,
  handlerMaxWidth,
} from "../utils"

// 接收props
const props = defineProps<{
  children: MenuData
  tagsTriangleTop: number
  // 当子组件的 width 没有时 使用
  itemWidth: string
  authWidth: string
  direction: directionType
  cloudDirection?: directionType
  left?: string
}>()
</script>

<style scoped lang="scss">
.sub-menu {
  margin-top: -5px !important;
}
</style>
