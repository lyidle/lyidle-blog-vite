<template>
  <ul class="custom-menu" v-if="props.data" :style="{ left }">
    <li class="title" ref="title"><span></span></li>
    <template v-for="item in props.data" :key="item.id">
      <li>
        <router-link :to="item.to" :style="{ width: width }">
          <i :class="item.icon"></i> <span>{{ item.name }}</span>
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts" name="Menu">
import { dataType } from "./type"
const props = withDefaults(
  defineProps<{
    top?: string
    left?: string
    width?: string
    triangle?: boolean
    gap?: string
    style?: {
      bg?: string
      bgHover?: string
      color?: string
      colorHover?: string
    }
    data: dataType
  }>(),
  {
    top: "20px",
    left: "-15px",
    width: "70px",
    triangle: false,
    gap: "15px",
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
const { bg, bgHover, color, colorHover } = props.style

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
$list: li;
// 引入头部变量
@include menuHover(custom-menu, $list, v-bind(hoverTop));
$menu-radius: 5px;
$menu-border-width: 10px;
$menu-item-height: 40px;
.custom-menu {
  position: absolute;
  flex-direction: column;
  color: v-bind(color);
  // 动画
  transition: top 0.3s;
  top: v-bind(initialTop);
  pointer-events: none;
  opacity: 0;
  > li {
    @include flex();
    position: relative;
    // 第一排三角形 的 li
    &.title {
      height: 20px;
      // 三角形
      span {
        background-color: transparent;
        // 重置宽高 使用border-width来画三角形
        width: 0;
        height: 0;
        // 在底部居中
        position: absolute;
        bottom: 0;
        margin: auto;
        // 绘制三角形
        border: $menu-border-width solid transparent;
        border-color: transparent transparent v-bind(bg) transparent;
      }
    }
    // li 里的第一层 a标签
    > a {
      @include flex(start);
      height: $menu-item-height;
      background-color: v-bind(bg);
      padding-left: v-bind(gap);
    }
    // 除了第一排的三角
    &:not([class="title"]) {
      overflow: hidden;
      > * {
        &:hover {
          background-color: v-bind(bgHover);
          color: v-bind(colorHover);
        }
      }
    }
    &:nth-child(2) {
      border-top-left-radius: $menu-radius;
      border-top-right-radius: $menu-radius;
    }
    &:last-child {
      border-bottom-left-radius: $menu-radius;
      border-bottom-right-radius: $menu-radius;
    }
  }
}
</style>
