<template>
  <el-table v-bind="$attrs" ref="instance" class="my-table">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-table>
</template>

<script setup lang="ts" name="MyTable">
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
.my-table {
  --el-table-bg-color: var(--table-bg);
  --el-table-header-text-color: var(--table-color);
  --el-table-text-color: var(--primary-color);
  --el-table-header-bg-color: var(--table-bg);
  --el-table-tr-bg-color: var(--table-bg);
  --el-table-row-hover-bg-color: var(--table-bg-hover);
  --el-table-border-color: var(--table-border);
}
</style>
