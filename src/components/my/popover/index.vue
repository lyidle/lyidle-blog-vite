<template>
  <div class="custom-popover" :style="{ left, right, transform }">
    <div class="title"></div>
    <slot></slot>
    <div class="popover-mask"></div>
  </div>
</template>

<script setup lang="ts" name="MyPopover">
const props = withDefaults(
  defineProps<{
    top?: string
    left?: string
    right?: string
    transform?: string
    width?: string
    height?: string
    bg?: string
    triangle?: { show?: string; left?: string; right?: string }
  }>(),
  {
    top: "",
    right: "",
    left: "",
    transform: "",
    width: "100px",
    height: "70px",
    bg: "var(--popover-bg)",
    triangle: () => ({
      show: "true",
      left: "45%",
      right: "unset",
    }),
  }
)
const initialTop = `${parseFloat(props.top) + 10}px`
const hoverTop = props.top
const triangleLeft = props.triangle.left
const triangleRight = props.triangle.right
</script>

<style scoped lang="scss">
$triangle-width-size: 10px;
// 需要悬浮的父级列表
$list: custom-popover-trigger;
// 引入头部变量
$menu-radius: 5px;
$menu-border-width: 10px;
$menu-color-light: v-bind(bg);
// 使用的嵌套写法 如果是菜单在body分开的话，定位有点死板
@each $mEl in $list {
  .#{$mEl}:hover {
    > .custom-popover {
      // 动画
      pointer-events: unset;
      top: v-bind(hoverTop);
      opacity: 1;
    }
  }
}
.custom-popover {
  width: v-bind(width);
  height: v-bind(height);
  position: absolute;
  color: var(--popover-color);
  // 动画
  transition: top 0.3s;
  top: v-bind(initialTop);
  opacity: 0;
  pointer-events: none;
  .title {
    position: absolute;
    top: 0;
    height: 10px;
    width: 100%;
    transform: translateY(-100%);
  }
  .popover-mask {
    position: absolute;
    inset: 0;
    background-color: $menu-color-light;
    border-radius: $menu-radius;
    z-index: -1;
    filter: drop-shadow(-3px 3px 3px rgba(52, 46, 46, 0.237));
    &::before {
      display: block;
      content: "";
      position: absolute;
      top: 0;
      left: v-bind(triangleLeft);
      right: v-bind(triangleRight);
      width: 0;
      height: 0;
      border: $triangle-width-size solid transparent;
      border-bottom-color: $menu-color-light;
      transform: translateY(-100%);
    }
  }
}
</style>
