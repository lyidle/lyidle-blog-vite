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
