<template>
  <div class="generate-container my-accordion">
    <my-menu-accordion-recursive v-bind="$attrs">
      <!-- 把 item的 插槽 放到父级 方便使用 -->
      <template v-for="(_, name) in slots" #[name]="scopedData">
        <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
        <slot :name="name" v-else></slot>
      </template>
    </my-menu-accordion-recursive>
  </div>
</template>

<script setup lang="ts" name="Accordion">
const slots = defineSlots()
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
