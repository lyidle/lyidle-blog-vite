<template>
  <li class="menu-item">
    <slot></slot>
  </li>
</template>

<script setup lang="ts" name="MyMenuItem">
const props = withDefaults(
  defineProps<{
    style?: {
      bgHover?: string
      color?: string
      colorHover?: string
    }
  }>(),
  {
    style: () => ({
      bg: "var(--menu-bg)",
      bgHover: "var(--menu-bg-hover)",
      color: "var(--menu-color)",
      colorHover: "var(--menu-color-hover)",
    }),
  }
)
const { bgHover, colorHover } = props.style
</script>

<style scoped lang="scss">
$menu-radius: var(--menu-radius);
.menu-item {
  @include flex();
  position: relative;
  min-width: 70px;
  min-height: 30px;
  &:hover {
    background-color: v-bind(bgHover);
    color: v-bind(colorHover);
  }
  // 圆角
  &:nth-of-type(2) {
    border-top-left-radius: $menu-radius;
    border-top-right-radius: $menu-radius;
  }
  &:nth-last-of-type(1) {
    border-bottom-left-radius: $menu-radius;
    border-bottom-right-radius: $menu-radius;
  }
}
</style>
