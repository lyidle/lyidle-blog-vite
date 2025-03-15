<template>
  <el-input v-bind="$attrs" ref="instance">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts" name="MyInput">
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
.el-input__wrapper {
  &.is-focus {
    box-shadow: unset;
  }
  &:hover {
    box-shadow: unset;
  }
  background-color: transparent !important;
  box-shadow: unset;
  --el-disabled-border-color: none;
  border-radius: unset;
  border-bottom: 1px solid var(--primary-input-underline-bg);
  margin: 0.0625rem 0.6875rem;
  padding: unset;
  --el-color-danger: transparent;
  .el-icon {
    color: var(--primary-input-color);
  }
  input {
    height: 1.5rem;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.8125rem;
    transition: font-size var(--primary-during);
    color: var(--primary-input-color) !important;
    -webkit-text-fill-color: var(--primary-input-color) !important;
    &:focus {
      font-size: 0.9375rem;
    }
    &::placeholder {
      color: var(--primary-input-placeholder);
    }
  }
}

// input
.login-container .el-input__wrapper {
  .el-icon {
    color: var(--login-input-color);
  }
  border-bottom: 1px solid var(--login-input-underline-bg);
  input {
    transition: font-size var(--primary-during);
    color: var(--login-input-color) !important;
    -webkit-text-fill-color: var(--login-input-color) !important;
    &::placeholder {
      color: var(--login-input-placeholder);
    }
  }
}
</style>
