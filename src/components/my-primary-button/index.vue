<template>
  <el-button v-bind="$attrs" class="w-100%" type="primary">
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts" name="MyInput"></script>

<style scoped lang="scss">
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
</style>
