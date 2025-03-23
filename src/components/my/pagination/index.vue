<template>
  <el-pagination
    v-model="value"
    v-bind="$attrs"
    ref="instance"
    hide-on-single-page
  >
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-pagination>
</template>

<script setup lang="ts" name="MyPagination">
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

<style scoped lang="scss">
.el-pagination {
  // 中间部分按钮
  // 字体颜色
  --el-text-color-primary: var(--pagination-color);
  --el-pagination-hover-color: var(--pagination-color-hover);
  // 填充颜色
  --el-fill-color: var(--pagination-bg);
  // 填充颜色 激活的按钮
  --el-color-primary: var(--pagination-bg-active);

  // 左右按钮disabled
  // 字体颜色
  --el-text-color-placeholder: var(--pagination-color-disabled);
  --el-disabled-bg-color: var(--pagination-bg-disabled);
  ::v-deep(.el-pagination__goto) {
    color: var(--primary-color);
  }

  ::v-deep(.el-pagination__classifier) {
    color: var(--primary-color);
  }

  //  jumper 的 select
  ::v-deep(.el-select) {
    // 字体颜色
    --el-text-color-regular: var(--pagination-color);
    --el-text-color-placeholder: var(--pagination-color);
    // 填充颜色
    --el-fill-color-blank: var(--pagination-bg);
    --el-border-color: var(--pagination-bg);
    --el-color-primary: var(--pagination-bg);
    --el-border-color-hover: var(--pagination-bg);
  }
}
</style>

<!-- jumper 的 select 的options  是全局的不是子元素 -->
<style lang="scss">
// options
.el-popper:has(.el-select-dropdown) {
  --el-text-color-regular: var(--pagination-color);
  --el-fill-color-light: var(--pagination-bg-active);
  &.is-light,
  &.is-light > .el-popper__arrow:before {
    --el-bg-color-overlay: var(--pagination-bg);
    --el-border-color-light: var(--pagination-bg);
  }
  .el-select-dropdown__item.is-selected {
    --el-color-primary: var(--pagination-color-hover);
    font-weight: normal;
  }
}
</style>
