<template>
  <el-input v-bind="$attrs" ref="instance">
    <template v-for="(_, name) in slots" #[name]="scopedData" :key="name">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts" name="MyInput">
import { useExposeInstance } from "@/hooks/useExposeInstance"

const instance = ref()
const slots = defineSlots()

// 使用 Hook
const { exposed } = useExposeInstance(instance)

// 在组件的 <script setup> 中调用 defineExpose
defineExpose(exposed)
</script>

<style scoped lang="scss">
::v-deep(.el-input__wrapper) {
  &.is-focus {
    box-shadow: unset;
  }
  &:hover {
    box-shadow: unset;
  }
  background-color: unset;
  box-shadow: unset;
  border-radius: unset;
  border-bottom: 1px solid var(--primary-input-underline-bg);
  margin: 0.0625rem 0.6875rem;
  padding: unset;
  --el-color-danger: transparent;
  input {
    height: 1.5rem;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.8125rem;
    transition: font-size var(--primary-during);
    color: var(--primary-input-color);
    &:focus {
      font-size: 0.9375rem;
    }
    &::placeholder {
      color: var(--primary-input-placeholder);
    }
  }
}
</style>
