<template>
  <div class="global-container">
    <SetThemes></SetThemes>
    <ClickEffect></ClickEffect>
    <MoveEffect></MoveEffect>
    <LayoutSet></LayoutSet>
    <LayoutDisplay></LayoutDisplay>
  </div>
</template>

<script setup lang="ts" name="LayoutSetting">
// 引入 子组件
import SetThemes from "./setThemes/index.vue"
import ClickEffect from "./clickEffect/index.vue"
import MoveEffect from "./moveEffect/index.vue"
import LayoutSet from "./layoutSet/index.vue"
import LayoutDisplay from "./layoutDisplay/index.vue"
</script>

<style scoped lang="scss">
@use "sass:list";
$gap: 0.3125rem;
$preview-gap: 0.9375rem;
// 上下边距
$title-m-vert: 1.25rem, 0.625rem;
$content-m-l: 3.125rem;
.global-container {
  ::v-deep(> .item) {
    // 头部
    > .title {
      margin: unset;
      margin-top: list.nth($title-m-vert, 1);
      margin-bottom: list.nth($title-m-vert, 2);
    }
    // 主题设置
    > .theme-select {
      display: flex;
      flex-direction: column;
      gap: $gap;
      // 主题预览 切换
      > .preview {
        display: flex;
        gap: $preview-gap;
        align-items: center;
        margin-left: $content-m-l;
        @include media(sm) {
          margin-left: 0;
        }
        .item {
          display: flex;
          gap: $gap;
          align-items: center;
          &.select-theme {
            // 标签
            .label {
              width: 9.0625rem;
            }
            // 多选框
            .el-select {
              width: 6.25rem;
            }
          }
        }
      }
      // 全部多选框的夫容器
      > .contain {
        display: flex;
        gap: $gap;
        margin-left: $content-m-l;
        > .item {
          display: flex;
          gap: $gap;
          align-items: center;
          // 标签
          .label {
            width: 6rem;
          }
          // 多选框
          .el-select {
            width: 6.25rem;
          }
        }
      }
    }
  }
}
</style>
