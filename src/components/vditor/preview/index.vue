<template>
  <div class="my-vditor-container relative">
    <div class="flex justify-end relative">
      <h1 class="absolute top-0 left-50% translate-x-[-50%] cur-text">
        {{ article?.title }}
      </h1>
      <div
        class="flex-shrink-0 float-right mt-10px mr-10px flex flex-col gap-15px"
      >
        <slot name="btns"></slot>
        <my-button
          class="w-initial"
          size="small"
          @click="exportHtml"
          v-if="isExportHtml"
          >导出HTML文件</my-button
        >
        <slot name="btns-end"></slot>
      </div>
    </div>
    <div ref="docPreview" class="cur-text vditor-style"></div>
  </div>
</template>

<script setup lang="ts" name="VditorPreview">
// 引入 文章渲染函数
import { useVditorPreview } from "@/hooks/Doc/vditorPreview"
// 引入 文章侧边目录高亮显示
import { useSideMenuHighlight } from "@/hooks/Doc/sideMenuHighlight"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import type { TocNode } from "@/hooks/Doc/vditorPreview/types"
import { exportHtmlFile } from "@/hooks/Doc/export/exportHtml"
// markdown 渲染的容器
const docPreview = ref<HTMLDivElement | undefined>()
const article = defineModel<GetOneArticle["data"]>("article")
const menuTree = defineModel<TocNode[]>("menuTree")
const title = defineModel<string>("title")

const props = withDefaults(
  defineProps<{
    isExportHtml?: boolean
    autoPreview?: boolean
    article?: GetOneArticle["data"]
    after?: () => void
  }>(),
  {
    isExportHtml: true,
  }
)
onMounted(() => {
  if (props.article) article.value = props.article
})
// 调用 渲染文章
const html = useVditorPreview({
  article,
  menuTree,
  docPreview,
  observerHeading: useSideMenuHighlight,
  autoPreview: props.autoPreview,
  after: props.after,
})

// 导出 为 html
const exportHtml = () => {
  const h1Name = document.querySelector(
    "#vditor-preview h1"
  ) as HTMLAnchorElement

  const fileName = title.value || h1Name?.innerText || "LyidleのBlog"
  exportHtmlFile(html.value, fileName)
}
</script>

<style scoped lang="scss">
.my-vditor-container {
  // markdown 预览
  ::v-deep(.vditor-style) {
    overflow: hidden;
    padding: 40px;
    padding-top: 20px;
    box-shadow: none;
  }
}
</style>
