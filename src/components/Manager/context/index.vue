<template>
  <div class="manager-context">
    <manager-context-tools></manager-context-tools>
    <div class="manager-context-review">
      <my-card class="card_style"> <slot></slot> </my-card>
    </div>
  </div>
</template>

<script setup lang="ts" name="ManagerContext">
//
</script>
<style scoped lang="scss">
// 设置 卡片 样式
@include setManagerCardStyle;
.manager-context {
  width: calc(100% - var(--manager-aside-width));
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: $manager-context-index;
  .manager-context-review {
    height: calc(100% - $manager-context-tools-height);
    padding: 30px;
    overflow: hidden;
    position: relative;
    z-index: $manager-content-index;
  }
}
</style>
