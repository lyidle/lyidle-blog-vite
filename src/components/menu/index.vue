<template>
  <ul class="custom-menu" v-if="props.data">
    <li class="title"><span></span></li>
    <li v-for="item in props.data" :key="item.id">
      <router-link :to="item.to">{{ item.name }}</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts" name="Menu">
import { menuData } from "@/api/header/type"
const props = defineProps({
  top: { type: String, default: "20px" },
  left: { type: String, default: "-20px" },
  data: {
    type: Object as () => menuData[],
    required: true,
  },
})
const initialTop = `${parseFloat(props.top) + 10}px`
const hoverTop = props.top
const left = props.left
</script>

<style scoped lang="scss">
// 引入头部变量
li:hover {
  > .custom-menu {
    // 动画
    pointer-events: unset;
    top: v-bind(hoverTop);
    opacity: 1;
  }
}
$menu-radius: 5px;
$menu-border-width: 10px;
$menu-item-height: 35px;
$menu-color-light: white;
$menu-bg-light-hover: var(--header-topnav-mask-color);
$menu-color-light-hover: var(--primary-color);
.custom-menu {
  position: absolute;
  left: v-bind(left);
  width: 100px;
  flex-direction: column;
  color: var(--primary-color);
  // 动画
  transition: top 0.3s;
  top: v-bind(initialTop);
  pointer-events: none;
  opacity: 0;
  > li {
    @include flex-center;
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
        border-color: transparent transparent $menu-color-light transparent;
      }
    }
    // li 里的第一层 a标签
    > * {
      @include flex-center;
      width: 100%;
      height: $menu-item-height;
      background-color: $menu-color-light;
    }
    // 除了第一排的三角
    &:not([class="title"]) {
      overflow: hidden;
      > * {
        &:hover {
          background-color: $menu-bg-light-hover;
          color: $menu-color-light-hover;
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
