<template>
  <li class="custom-menu-trigger">
    <my-anchor>
      <parse-icon :icon="data.icon"></parse-icon>
      {{ data.name }}
    </my-anchor>
    <my-menu :triangle="true" :menuStyle class="my-menu-container">
      <my-menu-item
        :style="menuStyle"
        class="custom-menu-trigger"
        v-for="item in data.children"
      >
        <!-- menuMathMax 禁止小于最小的值 itemWidth 且需要取最大值 -->
        <my-anchor
          :to="item.to"
          class="custom-menu-item"
          :style="{ width: menuMathMax(parentMaxWidth, itemWidth) }"
        >
          <parse-icon :icon="data.icon"></parse-icon>
          <span class="text-nowrap">{{ item.name }}</span>
          <i
            v-if="item.children?.length"
            class="i-weui:arrow-outlined toggle"
            :style="`${
              directionCallback(item.layout?.topnavDirection, direction) ===
              'left'
                ? 'left:0'
                : 'right:0'
            };--toggle-dir:${
              directionCallback(item.layout?.topnavDirection, direction) ===
              'left'
                ? '-1'
                : '1'
            }`"
          ></i>
        </my-anchor>
        <!-- menuMathMax 禁止小于最小的值 itemWidth 且需要取最大值 -->
        <recursive
          v-if="item.children?.length"
          :menuStyle
          :children="item.children"
          :tagsTriangleTop="tagsTriangleTop"
          :direction
          :itemWidth
          :authWidth="menuMathMax(parentMaxWidth, itemWidth)"
          :cloudDirection="item.layout?.topnavDirection"
        ></recursive>
      </my-menu-item>
    </my-menu>
  </li>
</template>

<script setup lang="ts" name="MyMenuInstance">
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"
import { directionType, MenuItem } from "./types"
// 引入 子组件
import recursive from "./recursive/index.vue"
// 引入 辅助函数
import { directionCallback, handlerMaxWidth, menuMathMax } from "./utils"

// 接收props
const props = withDefaults(
  defineProps<{
    menuStyle?: menuStyleType
    data: MenuItem
    item_h?: string
    iconM_r?: string
    iconP_l?: string
  }>(),
  {
    item_h: "var(--header-topmenu-icon-mr)",
    iconM_r: "var(--header-topmenu-h)",
    iconP_l: "var(--header-topmenu-icon-pl)",
  }
)

const parentMaxWidth = handlerMaxWidth(props.data)

// 默认的方向
const direction = ref<directionType>("left")
// 笔记
const itemWidth = "100px"
// 分类下 的 标签 menu的 三角位置
const tagsTriangleTop = -20
</script>

<style lang="scss">
$icon-mr: var(--header-topmenu-icon-mr);
$menu-item-height: var(--header-topmenu-h);
$icon-pl: var(--header-topmenu-icon-pl);
.custom-menu-item {
  height: $menu-item-height;
  @include flex(start);
  padding-left: $icon-pl;
  gap: $icon-mr;
  overflow: hidden;
  // 箭头 的 变形
  @mixin transform($deg: 0deg) {
    transform: translateY(-50%) rotateZ(calc(#{$deg} * var(--toggle-dir)));
  }

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
