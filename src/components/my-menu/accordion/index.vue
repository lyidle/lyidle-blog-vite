<template>
  <div class="generate-container">
    <my-menu-accordion-recursive v-bind="$attrs"></my-menu-accordion-recursive>
  </div>
</template>

<script setup lang="ts" name="Accordion">
withDefaults(defineProps<{ radius?: string; margin?: string }>(), {
  radius: "0.625rem",
  margin: "0.8125rem",
})
</script>

<style scoped lang="scss">
// 第一层的元素 加上圆角 和边距
.generate-container {
  border-radius: v-bind(radius);
  overflow: hidden;
  margin: v-bind(margin);
}
</style>
