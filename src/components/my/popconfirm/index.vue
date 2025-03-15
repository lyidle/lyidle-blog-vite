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

<style lang="scss">
.el-popover.el-popper {
  --el-popover-bg-color: var(--popconfirm-bg);
  --el-popover-border-color: var(--popconfirm-bg);
  color: var(--primary-color);
}
</style>
