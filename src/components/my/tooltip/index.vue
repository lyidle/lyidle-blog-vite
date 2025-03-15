<template>
  <el-tooltip v-model="value" v-bind="$attrs" ref="instance">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts" name="MyTooltip">
const value = defineModel()

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
.el-popper.is-dark,
.el-popper.is-dark > .el-popper__arrow:before {
  background: var(--tooltip-bg);
  color: var(--tooltip-color);
  border: 1px solid var(--tooltip-border-color);
}
</style>
