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
        :maxlength="maxCounts"
        @focus="commentFocus"
        @blur="isFocus = false"
        @input="handlerInput"
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
        <my-button
          class="h-30px rounded-5px"
          size="small"
          @click="addArticleComments"
          >发布</my-button
        >
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
// 引入 api
import { addComment } from "@/api/comments"
// 引入 类型
import type { AddCommentBody } from "@/api/comments/types/addCommentBody"
// 替换 文本里的 图片为永久 链接
import { useMdReplaceImg } from "@/hooks/Doc/vditorEditor/mdImgToLinkPermanent"
// 监听器 hook
import { useEventListener } from "@/hooks/useEventListener"
// 处理 特殊字符 正则替换
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 防抖
import debounce from "@/utils/debounce"
import { handlerReqErr } from "@/utils/request/error/successError"

// 处理 文件上传
import {
  clickUpload,
  clickUploadNameMapType,
  fileToImgMd,
  nameToMdImg,
  tempFileUpload,
} from "@/utils/upload"

const props = defineProps<{ articleId: number; reqComments: () => void }>()
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
const initialMinCounts = 300
// 有图片等信息
const initialMaxCounts = 800

// 最大 输入字数
const maxCounts = ref(initialMinCounts)
// 输入框 的实例
const inputRef = ref()

// 输入框 聚焦 事件
const commentFocus = () => {
  isFocus.value = true
  isShowTools.value = true
}

// 判断 是否 是 有图片等信息
// 处理 maxcount
const handlerCounts = () => {
  // 判断 是否 是 有图片等信息
  const reg = /!\[.*?\]\(.*?\)/
  if (!reg.test(comment.value)) {
    return (maxCounts.value = initialMinCounts)
  }
  maxCounts.value = initialMaxCounts
}

// 输入框 输入 事件
const handlerInput = debounce(handlerCounts, 500)

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
  try {
    const updateBody: AddCommentBody = {
      articleId: id,
      content: "",
    }
    await useMdReplaceImg(comment.value, updateBody, {
      path: "/comments",
    })
    await addComment(updateBody)
    comment.value = ""
    ElMessage.success("添加评论成功~")
    await props?.reqComments?.()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("添加评论失败~")
    await props?.reqComments?.()
  }
}

// 处理 点击文件的 上传 图片
const handlerUpload = async (e: Event) => {
  try {
    const { files, nameMap } = await clickUpload()
    const mdUrl = fileToImgMd(files)
    // 不等待 ，等成功后 自动替换
    handlerSuccessFile(files, nameMap)
    // 更新 值
    comment.value += mdUrl
  } catch (error) {
    console.error(error)
  }
}

// 替换文件的内容
const handlerSuccessFile = async (
  files: File[],
  nameMap: clickUploadNameMapType
) => {
  const result = await tempFileUpload(files, {
    errorCallback: (name) => {
      const errorName = nameMap[name] || name
      if (errorName) ElMessage.error(`上传文件${errorName}失败`)
    },
  })
  // 处理 失败的 文件
  if (result?.error.length) {
    // 获取需要替换的文本内容
    let commentContent = comment.value
    for (const value of result.error) {
      const originImg = nameToMdImg(value)
      const regex = new RegExp(escapeUrlForRegExp(originImg), "g")
      commentContent = commentContent.replace(regex, "")
    }
    comment.value = commentContent
    // 重新 计算 最大值
    handlerCounts()
    // 聚焦文本框
    nextTick(() => {
      inputRef.value?.instance?.focus?.()
    })
  }

  // 处理 成功 的文件
  if (!result?.success?.length) return

  // 获取需要替换的文本内容
  let commentContent = comment.value

  // for 循环 生成 正则
  for (const [fileName, tempUrl] of result?.success) {
    const originImg = nameToMdImg(fileName)
    // 使用正则表达式全局替换 originImg 为 newImg
    const newImg = nameToMdImg(tempUrl).replace(/\\/g, "/") // 统一路径格式
    const regex = new RegExp(escapeUrlForRegExp(originImg), "g")

    commentContent = commentContent.replace(regex, newImg)
  }

  // 更新 comment.value 为替换后的内容
  comment.value = commentContent
  // 重新 计算 最大值
  handlerCounts()

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
    margin-left: 65px;
  }
}
</style>
