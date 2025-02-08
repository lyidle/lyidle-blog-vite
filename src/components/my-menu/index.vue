<template>
  <ul class="custom-menu" :style="{ left }">
    <li class="title" ref="title" v-if="triangle" v-bind="triangleAttrs">
      <span></span>
    </li>
    <slot></slot>
    <template v-if="data.length">
      <!-- 优先 id 然后 name 最后 item本身 作为 key -->
      <template v-for="item in data" :key="item.id || item.name || item">
        <my-menu-item :style="menuStyle">
          <slot name="body" :item="item">
            {{ item.name }}
          </slot>
        </my-menu-item>
      </template>
    </template>
  </ul>
</template>

<script setup lang="ts" name="MyMenu">
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"
const props = withDefaults(
  defineProps<{
    top?: string
    left?: string
    triangle?: boolean
    triangleAttrs?: any
    menuStyle?: menuStyleType
    data?: any[]
  }>(),
  {
    data: () => [],
    top: "30px",
    left: "-15px",
    triangle: false,
    menuStyle: () => ({
      bg: "white",
      bgHover: "#e5baee",
      color: "#203b5b",
      colorHover: "#203b5b",
    }),
  }
)
const initialTop = `${parseFloat(props.top) + 10}px`
const hoverTop = props.top
const { bg, color } = props.menuStyle
</script>
<style scoped lang="scss">
// 需要悬浮的父级列表
$list: custom-menu-trigger;
// 使用的嵌套写法 如果是菜单在body分开的话，定位有点死板
@each $mEl in $list {
  .#{$mEl}:hover {
    > .custom-menu {
      // 动画
      pointer-events: unset;
      top: v-bind(hoverTop);
      opacity: 1;
    }
  }
}
$menu-radius: 5px;
$menu-triangle-width: 10px;
.custom-menu {
  position: absolute;
  flex-direction: column;
  color: v-bind(color);
  // 动画
  transition: top 0.3s;
  top: v-bind(initialTop);
  pointer-events: none;
  opacity: 0;
  .title {
    height: 20px;
    position: relative;
    display: flex;
    z-index: -3;
    // 三角形
    span {
      background-color: transparent;
      // 重置宽高 使用border-width来画三角形
      width: 0;
      height: 0;
      // 在底部居中
      position: relative;
      bottom: -1px;
      margin: auto;
      // 绘制三角形
      border: $menu-triangle-width solid transparent;
      border-color: transparent transparent v-bind(bg) transparent;
    }
  }
}
</style>
