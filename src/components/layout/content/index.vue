<template>
  <div class="pages">
    <div class="contain">
      <layout-content-card>
        <template #description>这是博客魔改教程总结的第六期</template>
        <template #title>排序算法专题</template>
        <template #publish>发表于2023-1-6</template>
        <template #update>更新于2023-1-61</template>
        <template #category>分类text</template>
        <template #label>标签text</template>
      </layout-content-card>
      <layout-content-card>
        <template #description>这是博客魔改教程总结的第六期</template>
        <template #title>排序算法专题</template>
        <template #publish>发表于2023-1-6</template>
        <template #update>更新于2023-1-61</template>
        <template #category>分类text</template>
        <template #label>标签text</template>
      </layout-content-card>
      <layout-content-card>
        <template #description>这是博客魔改教程总结的第六期</template>
        <template #title>排序算法专题</template>
        <template #publish>发表于2023-1-6</template>
        <template #update>更新于2023-1-61</template>
        <template #category>分类text</template>
        <template #label>标签text</template>
      </layout-content-card>
    </div>
    <my-card class="content-aside">
      <template #body>132</template>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="Content">
//
</script>

<style scoped lang="scss">
// 左右间距
$item-gap: 15px;
.pages {
  width: var(--content-width);
  inset: 0;
  margin: auto;
  height: 100vh;
  transition: width var(--header-bg-during);
  display: flex;
  justify-content: space-between;
  gap: $item-gap;
  margin-top: 20px;
  /* 左边内容区 */
  .contain {
    width: 100%;
    display: flex;
    gap: $item-gap;
    justify-content: space-between;
  }
  /* 右边侧边栏 */
  .content-aside {
    width: 400px;
    height: 400px;
    background-color: var(--content-card-bg);
    color: var(--primary-color);
    box-shadow: var(--content-shadow);
    transition: transform var(--primary-during);
    &:hover {
      transform: translateY(-10px);
    }
  }
}
</style>
