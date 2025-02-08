<template>
  <div class="menu-item">
    <parse-icon :icon="icon"></parse-icon>
    <span>{{ content }}</span>
  </div>
</template>

<script setup lang="ts" name="ContextItem">
defineProps<{ icon: string; content: string }>()
</script>

<style scoped lang="scss">
$item-radius: 5px;
$item-gap: 5px;
$item-icon-size: 20px;
.menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: var(--cursor-pointer);
  // 图标与文字的距离
  gap: 5px;
  border-radius: $item-radius;
  padding: 5px 0;
  // 间距
  margin: $item-gap;
  i {
    font-size: $item-icon-size;
  }
  &:hover {
    background-color: var(--context-menu-bg-hover);
    color: var(--context-menu-color-hover);
  }
}
</style>
