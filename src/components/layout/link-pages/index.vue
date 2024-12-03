<template>
  <div class="header-title">
    <router-link class="contain" to="">
      <div class="title">文章</div>
      <div class="content text-14px">7558</div>
    </router-link>
    <router-link class="contain" to="">
      <div class="title">标签</div>
      <div class="content text-14px">2464</div>
    </router-link>
    <router-link class="contain" to="">
      <div class="title">分类</div>
      <div class="content text-14px">35436</div>
    </router-link>
  </div>
</template>

<script setup lang="ts" name="LinkPages">
//
</script>

<style scoped lang="scss">
.header-title {
  $gap: 15px;
  $header-title-pd: 30px;
  display: flex;
  justify-content: space-between;
  margin-top: $gap;
  padding: 0 $header-title-pd;
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include pages-links-hover;
  }
  .contain {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
}
</style>
