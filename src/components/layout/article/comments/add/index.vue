<template>
  <div class="add-comments pb-20px">
    <div class="overflow-hidden mt-20px flex gap-10px">
      <!-- 头像 -->
      <global-avatar
        :isCenter="false"
        :isTo="false"
        :isCursor="false"
        style="--avatar-size: 60px"
      ></global-avatar>
      <!-- 输入框 -->
      <my-input
        type="textarea"
        v-model="comment"
        :autosize="{ minRows: 2, maxRows: 4 }"
        show-word-limit
        maxlength="300"
        @focus="commentFocus"
        @blur="isFocus = false"
        ref="inputRef"
      ></my-input>
    </div>
    <!-- 文本框下的 工具栏 -->
    <div v-show="isShowTools" class="ml-70px my-10px flex justify-between">
      <!-- 左侧 按钮 -->
      <div class="tool-btns">
        <div
          class="i-clarity:picture-line mt-1px ml-[-0.5px]"
          @click="handlerUpload"
        ></div>
      </div>
      <!-- 右侧 按钮 -->
      <div class="flex">
        <my-button
          type="default"
          class="h-30px rounded-5px"
          size="small"
          @click="isPreview = !isPreview"
          >预览</my-button
        >
        <my-button class="h-30px rounded-5px" size="small">发布</my-button>
      </div>
    </div>
    <!-- 渲染 文章 -->
    <vditor-preview
      v-model:article="previewComment"
      :isExportHtml="false"
      :autoPreview="true"
      v-if="isPreview"
    ></vditor-preview>
  </div>
</template>

<script setup lang="ts" name="AddArticleComments">
import { getComments } from "@/api/comments"
import { useEventListener } from "@/hooks/useEventListener"
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 处理 文件上传
import {
  clickUpload,
  fileToImgMd,
  nameToMdImg,
  tempFileUpload,
} from "@/utils/upload"

const props = defineProps<{ articleId: number }>()
// 评论 信息
const comment = ref("")
// vditor 预览 需要的格式
const previewComment = computed(() => ({ content: comment.value }))
// 是否 显示 工具栏
const isShowTools = ref(false)
// 是否 预览
const isPreview = ref(false)
// 是否 聚焦
const isFocus = ref(false)
const inputRef = ref()
// 输入框 聚焦 事件
const commentFocus = () => {
  isFocus.value = true
  isShowTools.value = true
}

// 向上 查找 是否是 评论
const isComments = (el: Element | null): boolean => {
  let isAccess = false
  const pre = (el: Element | null) => {
    if (!el) return
    if (el.classList) {
      const arr = Array.from(el.classList)
      // 判断是否是 add-comments
      if (arr.includes("add-comments")) {
        return (isAccess = true)
      }
      pre(el.parentElement)
    }
  }
  pre(el)
  return isAccess
}

// 监听 window 点击事件 取消 聚焦
useEventListener("click", (e) => {
  // 本来就关闭的 则 不进行 关闭 或者 输入框 聚焦 状态 则不关闭
  if (!isShowTools.value || isFocus.value) return
  const tar = e.target as Element
  // 判断 是否需要关闭 工具栏 和预览
  const isAccess = isComments(tar)
  // 没通过 关闭工具栏 和预览
  if (!isAccess) {
    isShowTools.value = false
    isPreview.value = false
  }
})

// 增加 评论
const addArticleComments = async () => {
  const id = props.articleId
  if (!props.articleId) return
}

// 处理 点击文件的 上传 图片
const handlerUpload = async (e: Event) => {
  try {
    const files = await clickUpload()
    const mdUrl = fileToImgMd(files)
    // 不等待 ，等成功后 自动替换
    handlerSuccessFile(files)
    // 更新 值
    comment.value += mdUrl
  } catch (error) {
    console.error(error)
  }
}

// 替换文件的内容
const handlerSuccessFile = async (files: File[]) => {
  const result = await tempFileUpload(files)
  if (!result?.length) return

  // 获取需要替换的文本内容
  let commentContent = comment.value

  // for 循环 生成 正则
  for (const [fileName, tempUrl] of result) {
    const originImg = nameToMdImg(fileName)
    // 使用正则表达式全局替换 originImg 为 newImg
    const newImg = nameToMdImg(tempUrl).replace(/\\/g, "/") // 统一路径格式
    const regex = new RegExp(escapeUrlForRegExp(originImg), "g")

    commentContent = commentContent.replace(regex, newImg)
  }

  // 更新 comment.value 为替换后的内容
  comment.value = commentContent

  // 聚焦文本框
  nextTick(() => {
    inputRef.value?.instance?.focus?.()
  })
}
</script>

<style scoped lang="scss">
.add-comments {
  // 左侧 的按钮
  .tool-btns {
    width: 30px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    border: 1px solid var(--primary-scend-color);
    cursor: var(--cursor-pointer);
  }
  // 改变 vditor 的样式
  ::v-deep(.vditor-reset) {
    padding: 10px;
    margin-left: 65px;
    margin-right: 5px;
    border: 1px solid var(--primary-scend-color);
  }
}
</style>
