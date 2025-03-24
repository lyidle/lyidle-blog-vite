<template>
  <el-pagination
    v-model="value"
    v-bind="$attrs"
    ref="instance"
    hide-on-single-page
    :background="false"
  >
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-pagination>
</template>

<script setup lang="ts" name="MyPaginationText">
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
%transparent {
  background-color: transparent;
}

%disabled-btn {
  color: #a8abb2;
}
%color {
  color: var(--primary-color);
}
%color-hover {
  color: #409eff;
}
$color-active: #409eff;
.el-pagination {
  ::v-deep(button:disabled) {
    @extend %transparent;
  }
  ::v-deep(.el-pager) li {
    @extend %transparent;
    @extend %color;
    // 悬浮 样式
    &:not(.is-active):hover {
      @extend %color-hover;
    }
    // 激活 的样式
    &.is-active {
      color: $color-active;
    }
  }
  ::v-deep(button) {
    @extend %transparent;
    @extend %color;
    // 上一个 按钮 和下一个 按钮
    &.btn-prev,
    &.btn-next {
      // 禁用的 样式
      &:disabled {
        @extend %disabled-btn;
      }
      // 悬浮 样式
      &:not(:disabled):hover {
        @extend %color-hover;
      }
    }
  }
}
</style>
