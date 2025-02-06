<template>
  <layout-content>
    <template #content-start>
      <my-card class="card_style allDocs">
        个人空间--{{ $route.params.author }}
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="UserSpace">
//
</script>

<style scoped lang="scss">
// 设置 卡片 阴影
@include setCardShadow;
</style>
