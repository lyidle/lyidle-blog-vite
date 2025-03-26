<template>
  <el-popconfirm v-bind="$attrs" ref="instance" popper-class="my-popconfirm">
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts" name="MyPopconfirm">
// 得到 实例
const instance = ref()
// 得到 slots
const slots = defineSlots()
// 暴露 instance 给父组件
defineExpose({
  instance,
})
</script>

<!-- popconfirm 是全局的不是子元素 -->
<style lang="scss">
.my-popconfirm {
  --el-popover-bg-color: var(--popconfirm-bg);
  --el-popover-border-color: var(--popconfirm-bg);
  --el-bg-color-overlay: var(--popconfirm-bg);
  --el-border-color-light: var(--popconfirm-bg);
  color: var(--primary-color);
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.12);
  .el-popconfirm__main {
    user-select: text;
    cursor: var(--cursor-text);
    font-size: 13px;
    text-align: justify;
  }
}
</style>
