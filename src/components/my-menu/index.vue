<template>
  <ul class="custom-menu" v-if="props.data" :style="{ left }">
    <li class="title" ref="title"><span></span></li>
    <template v-for="item in props.data" :key="item.id">
      <my-menu-item :style="props.style">
        <slot name="body" :item="item">
          {{ item.name }}
        </slot>
      </my-menu-item>
    </template>
  </ul>
</template>

<script setup lang="ts" name="Menu">
const props = withDefaults(
  defineProps<{
    top?: string
    left?: string
    triangle?: boolean
    style?: {
      bg?: string
      bgHover?: string
      color?: string
      colorHover?: string
    }
    data: any
  }>(),
  {
    top: "20px",
    left: "-15px",
    triangle: false,
    style: () => ({
      bg: "white",
      bgHover: "#e5baee",
      color: "#203b5b",
      colorHover: "#203b5b",
    }),
  }
)
const initialTop = `${parseFloat(props.top) + 10}px`
const hoverTop = props.top
const { bg, color } = props.style

const title = ref()
nextTick(() => {
  // 顶部小三角
  if (props.triangle) {
    title.value.style.display = "flex"
  } else {
    title.value.style.display = "none"
  }
})
</script>

<style scoped lang="scss">
// 需要悬浮的父级列表
$list: custom-menu-trigger;
// 引入头部变量
@include menuHover(custom-menu, $list, v-bind(hoverTop));
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
    z-index: -1;
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
