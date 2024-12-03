<template>
  <div class="myCard body">
    <slot name="body"></slot>
  </div>
</template>

<script setup lang="ts" name="Card"></script>

<style scoped lang="scss">
// 高度
// $card-height: 350px;
.myCard {
  // height: $card-height;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  color: #2a4f7c;
  box-shadow: -5px 5px 10px var(--primary-bg-shadow);
}
</style>
