<template>
  <div class="manager-content">
    <manager-aside></manager-aside>
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="ManagerContent">
//
</script>
<style scoped lang="scss">
.manager-content {
  width: 100%;
  // 满屏减去 header 高度
  height: calc(100% - $manager-header-height);
  display: flex;
  position: relative;
  z-index: $manager-content-index;
}
</style>
