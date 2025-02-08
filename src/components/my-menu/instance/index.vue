<template>
  <li class="custom-menu-trigger">
    <my-anchor>
      <i class="i-lucide:notebook-pen w-1em h-1em"> </i>
      {{ name }}
    </my-anchor>
    <my-menu :triangle="true" left="-25px" :menuStyle class="my-menu-container">
      <template v-for="item in data">
        <my-menu-item :style="menuStyle" class="custom-menu-trigger">
          <my-anchor
            :to="item.to"
            class="custom-menu-item"
            :style="{ width: item.width || itemWidth }"
          >
            <i class="i-iconoir:page-star w-1em h-1em"></i>
            <span>{{ item.name }}</span>
          </my-anchor>
          <recursive
            v-if="item.children?.length"
            :menuStyle
            :children="item.children"
            :tagsTriangleTop="tagsTriangleTop"
            :triangleDirection
            :direction
            :itemWidth
            class="sub-menu"
          ></recursive>
        </my-menu-item>
      </template>
    </my-menu>
  </li>
</template>

<script setup lang="ts" name="MyMenuInstance">
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"
import { directionType, MenuData } from "./types"
// 引入 子组件
import recursive from "./recursive/index.vue"

const direction = ref<directionType>("right")
// 根据方向算出具体的值 子集的位置信息
const left = computed(() => {
  return direction.value === "left" ? "calc(-100% - 13px)" : "calc(100% + 13px)"
})

// 三角的位置信息
const triangleDirection = computed(() => {
  return direction.value === "left"
    ? {
        right: "-60%",
        top: "34px",
        transform: "rotateZ(90deg)",
      }
    : {
        right: "60%",
        top: "34px",
        transform: "rotateZ(270deg)",
      }
})

// 接收props
defineProps<{
  menuStyle?: menuStyleType
  data: MenuData
  name: string
}>()

// 笔记
const itemWidth = "90px"
// 分类下 的 标签 menu的 三角位置
const tagsTriangleTop = -20
</script>

<style lang="scss">
$icon-mr: var(--header-topmenu-icon-mr);
$menu-item-height: 25px;
$icon-pl: 15px;
.custom-menu-item {
  height: $menu-item-height;
  @include flex(start);
  padding-left: $icon-pl;
  gap: $icon-mr;
}
.sub-menu {
  left: v-bind(left) !important;
  margin-top: -5px !important;
}
</style>
