<template>
  <layout-content>
    <template #content-start>
      <my-card class="card_style allTags"> {{ author }} </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="FindAllUserTags">
const route = useRoute()
// 得到作者
const { author } = route.params
// 存储所有tags
const tags = ref<string[]>([])
</script>

<style scoped lang="scss">
// 设置 卡片 阴影
@include setCardShadow;
</style>
