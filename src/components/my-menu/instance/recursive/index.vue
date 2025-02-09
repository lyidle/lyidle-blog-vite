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
    :style="
      flowMenuContainerLeft(
        authWidth,
        directionCallback(cloudDirection || direction)
      )
    "
    :menuStyle
    class="sub-menu"
  >
    <my-menu-item
      :style="menuStyle"
      v-for="sub in children"
      :key="sub"
      class="custom-menu-trigger"
    >
      <my-anchor
        :to="sub.to"
        class="custom-menu-item"
        :style="{ width: authWidth }"
      >
        <parse-icon :icon="sub.icon"></parse-icon>
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
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"
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
  menuStyle?: menuStyleType
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
