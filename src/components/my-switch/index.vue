<template>
  <el-switch v-model="value" v-bind="$attrs" ref="instance" class="switch">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-switch>
</template>

<script setup lang="ts" name="MySwitch">
import { useExposeInstance } from "@/hooks/useExposeInstance"
const value = defineModel()

const instance = ref()
const slots = defineSlots()

// 使用 Hook
const { exposed } = useExposeInstance(instance)

// 在组件的 <script setup> 中调用 defineExpose
defineExpose(exposed)
</script>

<style scoped lang="scss">
.switch {
  --el-switch-on-color: var(--primary-switch-on);
  --el-switch-off-color: var(--primary-switch-off);
}
</style>
