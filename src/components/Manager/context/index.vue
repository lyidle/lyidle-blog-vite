<template>
  <div class="manager-context">
    <manager-header></manager-header>
    <el-breadcrumb
      :separator-icon="ArrowRight"
      class="breadcrumb ml-[var(--admin-content-pd)] mt-[var(--admin-content-card-gap)]"
    >
      <!-- 动态展示路由 -->
      <el-breadcrumb-item
        v-for="(item, index) in $route.matched"
        :key="index"
        v-show="item.meta.title"
        :to="item.path"
        class="crumb-item"
      >
        <icon-parse :icon="item.meta?.icon" class="icon"></icon-parse>
        <span>{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="manager-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="ManagerContext">
// 引入 图标
import ArrowRight from "@/components/icon/arrow-right/index.vue"
</script>
<style scoped lang="scss">
$crumb-unable-color: var(--header-crumb-unable-color);
$crumb-color: var(--header-crumb-color);
$crumb-color-hover: var(--header-crumb-color-hover);
// 左侧 面包屑
.breadcrumb {
  display: flex;
  .crumb-item {
    user-select: text;
    cursor: var(--cursor-text);
    // 没有激活的
    --el-text-color-regular: #{$crumb-unable-color};
    // 激活的
    --el-text-color-primary: #{$crumb-color};
    // 悬浮
    --el-color-primary: #{$crumb-color-hover};
    span {
      font-weight: normal;
      user-select: text;
      cursor: var(--cursor-text);
    }
  }
}
.manager-content {
  ::v-deep(.admin-container) {
    display: flex;
    flex-direction: column;
    gap: var(--admin-content-card-gap);
    @include adminHeaderBtns;
    .admin-content {
      padding: var(--admin-content-card-pd);
    }
  }
}
</style>
