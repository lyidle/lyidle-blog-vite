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
const value = defineModel()
const props = defineProps(["options"])

// 得到 实例
const instance = ref()
// 得到 slots
const slots = defineSlots()
// 暴露 instance 给父组件
defineExpose({
  instance,
})
</script>

<style scoped lang="scss"></style>
