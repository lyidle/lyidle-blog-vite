<template>
  <li class="menu-item">
    <slot></slot>
  </li>
</template>

<script setup lang="ts" name="MyMenuItem">
const props = withDefaults(
  defineProps<{
    style?: {
      bg?: string
      bgHover?: string
      color?: string
      colorHover?: string
    }
  }>(),
  {
    style: () => ({
      bg: "white",
      bgHover: "#e5baee",
      color: "#203b5b",
      colorHover: "#203b5b",
    }),
  }
)
const { bg, bgHover, colorHover } = props.style
</script>

<style scoped lang="scss">
$menu-radius: 5px;
.menu-item {
  @include flex();
  position: relative;
  overflow: hidden;
  background-color: v-bind(bg);
  min-width: 70px;
  min-height: 30px;
  &:hover {
    background-color: v-bind(bgHover);
    color: v-bind(colorHover);
  }
  // 圆角
  &:nth-child(2) {
    border-top-left-radius: $menu-radius;
    border-top-right-radius: $menu-radius;
  }
  &:last-child {
    border-bottom-left-radius: $menu-radius;
    border-bottom-right-radius: $menu-radius;
  }
}
</style>
