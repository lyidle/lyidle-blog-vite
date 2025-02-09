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
import { useExposeInstance } from "@/hooks/useExposeInstance"

const value = defineModel()
const props = defineProps(["options"])

const instance = ref()
const slots = defineSlots()
// 使用 Hook
const { exposed } = useExposeInstance(instance)

// 在组件的 <script setup> 中调用 defineExpose
defineExpose(exposed)
</script>

<style scoped lang="scss"></style>
