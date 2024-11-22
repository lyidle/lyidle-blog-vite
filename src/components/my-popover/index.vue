<template>
  <div class="custom-popover" :style="{ left, right }">
    <div class="triangle" ref="triangle">
      <div ref="depTriangle" class="depTriangle"></div>
    </div>
    <slot name="body"></slot>
  </div>
</template>

<script setup lang="ts" name="Menu">
const props = withDefaults(
  defineProps<{
    top?: string
    left?: string
    right?: string
    width?: string
    height?: string
    bg?: string
    triangle?: { show?: string; left?: string; right?: string }
  }>(),
  {
    top: "",
    right: "",
    left: "",
    width: "100px",
    height: "70px",
    bg: "white",
    triangle: () => ({
      show: "true",
      left: "",
      right: "",
    }),
  }
)
const initialTop = `${parseFloat(props.top) + 10}px`
const hoverTop = props.top
const triangle = ref()
const depTriangle = ref()
onMounted(() => {
  // 顶部小三角
  if (props.triangle.show === "true" || props.triangle.show === undefined) {
    triangle.value.style.display = "block"
  } else {
    triangle.value.style.display = "none"
  }
  if (props.triangle.left) {
    depTriangle.value.style.position = "absolute"
    depTriangle.value.style.left = props.triangle.left
  }
  if (props.triangle.right) {
    depTriangle.value.style.position = "absolute"
    depTriangle.value.style.right = props.triangle.right
  }
})
</script>

<style scoped lang="scss">
// 需要悬浮的父级列表
$list: li, span;
// 引入头部变量
$menu-radius: 5px;
$menu-border-width: 10px;
$menu-color-light: v-bind(bg);
// 悬浮动画
@include menuHover(custom-popover, $list, v-bind(hoverTop));
.custom-popover {
  width: v-bind(width);
  height: v-bind(height);
  position: absolute;
  background-color: $menu-color-light;
  border-radius: $menu-radius;
  color: var(--primary-color);
  // 动画
  transition: top 0.3s;
  top: v-bind(initialTop);
  opacity: 0;
  pointer-events: none;
  .triangle {
    width: 100%;
    height: $menu-border-width * 2;
    position: absolute;
    top: -$menu-border-width * 2;
    .depTriangle {
      width: $menu-border-width * 2;
      height: 100%;
      margin: auto;
      &::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        position: relative;
        bottom: -1px;
        border: $menu-border-width solid transparent;
        border-bottom-color: $menu-color-light;
      }
    }
  }
}
</style>
