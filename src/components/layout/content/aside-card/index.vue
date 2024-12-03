<template>
  <my-card class="item-aside">
    <template #body>
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="mt-10px body"><slot name="body"></slot></div>
    </template>
  </my-card>
</template>

<script setup lang="ts" name="WebInfo">
//
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  gap: var(--aside-title-gap);
}
</style>
