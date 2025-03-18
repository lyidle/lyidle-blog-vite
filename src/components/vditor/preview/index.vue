<template>
  <div class="my-vditor-container">
    <div
      id="vditor-preview"
      ref="docPreview"
      class="cur-text vditor-style"
    ></div>
  </div>
</template>

<script setup lang="ts" name="VditorPreview">
// 引入 文章渲染函数
import { useVditorPreview } from "@/hooks/Doc/vditorPreview"
// 引入 文章侧边目录高亮显示
import { useSideMenuHighlight } from "@/hooks/Doc/sideMenuHighlight"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import { TocNode } from "@/hooks/Doc/vditorPreview/types"
// markdown 渲染的容器
const docPreview = ref<HTMLDivElement | undefined>()
const article = defineModel<GetOneArticle["data"]>("article")
const menuTree = defineModel<Ref<TocNode[]>>("menuTree")
// 调用 渲染文章
// @ts-ignore
useVditorPreview(article, menuTree, docPreview, useSideMenuHighlight)
</script>

<style scoped lang="scss">
.my-vditor-container {
  // markdown 预览
  ::v-deep(.vditor-style) {
    overflow: hidden;
    padding: 0 40px;
  }
}
</style>
