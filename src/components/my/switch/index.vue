<template>
  <el-switch v-model="value" v-bind="$attrs" ref="instance" class="switch">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-switch>
</template>

<script setup lang="ts" name="MySwitch">
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

<style scoped lang="scss">
.switch {
  --el-switch-on-color: var(--primary-switch-on);
  --el-switch-off-color: var(--primary-switch-off);
}
</style>
