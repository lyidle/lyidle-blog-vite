<template>
  <layout-header />
  <layout-banner></layout-banner>
  <layout-content :isAllAside="false">
    <!-- 侧边栏 -->
    <template #aside-start>
      <layout-content-aside-card>
        <template #title>
          <i class="i-material-symbols:menu-rounded"></i>
          <span>目录</span>
        </template>
        <template #body> </template>
      </layout-content-aside-card>
    </template>
    <!-- 内容区 -->
    <template #content-start>
      <!-- 卡片 -->
      <div class="content">
        <my-card>
          <template #body> </template>
        </my-card>
      </div>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="Document">
//
</script>

<style scoped lang="scss">
@include content-aside-title(var(--aside-title-icon-bg));
.content {
  // 设置 卡片 阴影
  @include setCardShadow;
}
</style>
