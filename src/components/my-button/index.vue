<template>
  <el-button v-bind="$attrs" class="w-100%" type="primary" ref="instance">
    <template v-for="(_, name) in slots" :key="name" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-button>
</template>

<script setup lang="ts" name="MyButton_">
import { useExposeInstance } from "@/hooks/useExposeInstance"
const instance = ref()
const slots = defineSlots()

// 使用 Hook
const { exposed } = useExposeInstance(instance)

// 在组件的 <script setup> 中调用 defineExpose
defineExpose(exposed)
</script>

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
