<template>
  <my-menu
    :triangle="true"
    :top="`${tagsTriangleTop}px`"
    :triangleAttrs="{
      style: {
        ...triangleDirection,
        top:
          children.length === 1
            ? `calc(${triangleDirection.top} - 0.625rem)`
            : triangleDirection.top,
      },
    }"
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
        :style="{ width: sub.width || itemWidth }"
      >
        <i class="i-iconoir:page-star w-1em h-1em"></i>
        <span>{{ sub.name }}</span>
        <i
          v-if="sub.children?.length"
          class="i-weui:arrow-outlined toggle"
          :style="`${
            direction === 'left' ? 'left:0' : 'right:0'
          };--toggle-dir:${direction === 'left' ? '-1' : '1'}`"
        ></i>
      </my-anchor>
      <MyMenuInstanceRecursive
        v-if="sub.children?.length"
        v-bind="{ ...props, children: sub.children }"
        class="sub-menu"
      ></MyMenuInstanceRecursive>
    </my-menu-item>
  </my-menu>
</template>

<script setup lang="ts" name="MyMenuInstanceRecursive">
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"
import { MenuData, directionType } from "../types"
// 接收props
const props = defineProps<{
  menuStyle?: menuStyleType
  children: MenuData
  tagsTriangleTop: number
  triangleDirection: { [key in string]: string | undefined }
  // 当子组件的 width 没有时 使用
  itemWidth: string
  direction: directionType
}>()
</script>

<style scoped lang="scss">
// 箭头 的 变形
@mixin transform($deg: 0deg) {
  transform: translateY(-50%) rotateZ(calc(#{$deg} * var(--toggle-dir)));
}
.custom-menu-item {
  position: relative;
  .toggle {
    position: absolute;
    width: 1rem;
    height: 1rem;
    top: 50%;
    @include transform;
    transition: transform 0.3s;
  }
  &:hover {
    .toggle {
      @include transform(180deg);
    }
  }
}
</style>
