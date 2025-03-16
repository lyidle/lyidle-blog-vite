<template>
  <el-popconfirm v-bind="$attrs" ref="instance">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts" name="MyPopconfirm">
// 得到 实例
const instance = ref()
// 得到 slots
const slots = defineSlots()
// 暴露 instance 给父组件
defineExpose({
  instance,
})
</script>

<!-- popconfirm 是全局的不是子元素 -->
<style lang="scss">
.el-popper:has(.el-popconfirm) {
  --el-popover-bg-color: var(--popconfirm-bg);
  --el-popover-border-color: var(--popconfirm-bg);
  --el-bg-color-overlay: var(--popconfirm-bg);
  --el-border-color-light: var(--popconfirm-bg);
  color: var(--primary-color) !important;
}
</style>
