<template>
  <el-button v-bind="$attrs" class="w-100%" type="primary" ref="instance">
    <template v-for="(_, name) in slots" :key="name" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-button>
</template>

<script setup lang="ts" name="MyButton">
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
// button样式
.el-button--primary {
  transition: background var(--primary-during);
  --el-button-bg-color: var(--primary-btn-bg);
  --el-button-border-color: var(--primary-btn-bg);
  --el-button-text-color: var(--primary-btn-color);
  outline: none;
  --el-button-hover-bg-color: var(--primary-btn-hover-bg);
  --el-button-hover-border-color: var(--primary-btn-hover-bg);
  --el-button-hover-text-color: var(--primary-btn-hover-color);
  --el-button-active-bg-color: var(--primary-btn-hover-bg);
  --el-button-active-border-color: var(--primary-btn-hover-bg);
  --el-button-active-text-color: var(--primary-btn-hover-color);
}
// 按钮
// button样式
.login-button.el-button--primary {
  // active
  transition: background var(--primary-during);
  --el-button-bg-color: var(--login-btn-bg);
  --el-button-border-color: var(--login-btn-bg);
  --el-button-text-color: var(--login-btn-color);
  outline: none;
  --el-button-hover-bg-color: var(--login-btn-hover-bg);
  --el-button-hover-border-color: var(--login-btn-hover-bg);
  --el-button-hover-text-color: var(--login-btn-hover-color);
  --el-button-active-bg-color: var(--login-btn-hover-bg);
  --el-button-active-border-color: var(--login-btn-hover-bg);
  --el-button-active-text-color: var(--login-btn-hover-color);
  // disable
  --el-button-disabled-bg-color: var(--login-disabled-bg);
}
</style>
