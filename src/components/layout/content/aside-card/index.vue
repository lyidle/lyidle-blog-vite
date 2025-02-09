<template>
  <my-card class="item-aside card_style">
    <div class="aside-title">
      <slot name="title"></slot>
    </div>
    <div class="mt-10px body"><slot name="body"></slot></div>
  </my-card>
</template>

<script setup lang="ts" name="AsideCard">
//
</script>

<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle;
.aside-title {
  display: flex;
  align-items: center;
  gap: var(--aside-title-gap);
}
</style>
