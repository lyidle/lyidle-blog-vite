<template>
  <layout-content-aside-card class="container">
    <template #title>
      <i class="i-fluent:data-histogram-16-filled"></i>
      <span>小站资讯</span>
    </template>
    <template #body>
      <div class="item text">
        <div class="title">文章数目:</div>
        <div class="data">49</div>
      </div>
      <div class="item text">
        <div class="title">本站总字数:</div>
        <div class="data">24.6w</div>
      </div>
      <div class="item text">
        <div class="title">本站访客数:</div>
        <div class="data">145555</div>
      </div>
      <div class="item text">
        <div class="title">本站总访问量:</div>
        <div class="data">758827</div>
      </div>
      <div class="item text">
        <div class="title">最后更新时间:</div>
        <div class="data">2023-9-11</div>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="WebInfo">
//
</script>

<style scoped lang="scss">
$item-gap: 5px;
.container {
  @include content-aside-title(var(--aside-web-info-icon-bg));
  ::v-deep(.body) {
    display: flex;
    flex-direction: column;
    gap: $item-gap;
    .item {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
