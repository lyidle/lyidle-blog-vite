<template>
  <el-empty v-bind="$attrs" ref="instance" class="my-empty">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-empty>
</template>

<script setup lang="ts" name="MyEmpty">
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
.my-empty {
  p {
    color: var(--primary-color);
  }
}
</style>
