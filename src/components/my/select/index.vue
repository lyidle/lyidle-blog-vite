<template>
  <el-select
    v-model="value"
    placeholder="Select"
    size="small"
    :teleported="false"
    v-bind="$attrs"
    ref="instance"
  >
    <el-option
      v-for="item in props.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-select>
</template>

<script setup lang="ts" name="MySelect">
const value = defineModel()
const props = defineProps(["options"])

// 得到 实例
const instance = ref()
// 得到 slots
const slots = defineSlots()
// 暴露 instance 给父组件
defineExpose({
  instance,
})
</script>

<style scoped lang="scss">
.el-select {
  // 字体颜色
  --el-text-color-regular: var(--select-color);
  --el-text-color-placeholder: var(--select-color);
  // 填充颜色
  --el-fill-color-blank: var(--select-bg);
  --el-border-color: var(--select-bg);
  --el-color-primary: var(--select-bg);
  --el-border-color-hover: var(--select-bg);

  // options
  ::v-deep(.el-popper) {
    --el-fill-color-light: var(--select-bg-active);
    &.is-light,
    &.is-light > .el-popper__arrow:before {
      --el-bg-color-overlay: var(--select-bg);
      --el-border-color-light: var(--select-bg);
    }
    .el-select-dropdown__item.is-selected {
      --el-color-primary: var(--select-color-hover);
      font-weight: normal;
    }
  }
}
</style>
