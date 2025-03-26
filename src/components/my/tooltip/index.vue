<template>
  <el-tooltip
    v-model="value"
    v-bind="$attrs"
    ref="instance"
    popper-class="my-tooltip"
  >
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

<!-- el-popper是全局的 -->
<style lang="scss">
%primary {
  --x: 0;
  --y: 1px;
  --spread: 5px;
  background: var(--tooltip-bg) !important;
  color: var(--tooltip-color) !important;
  border: 1px solid var(--tooltip-border-color) !important;
  user-select: text !important;
  cursor: var(--cursor-text) !important;
}
.my-tooltip {
  @extend %primary;
  > .el-popper__arrow:before {
    @extend %primary;
  }
}
</style>
