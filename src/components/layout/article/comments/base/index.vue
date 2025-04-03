<template>
  <div class="add-comments pb-20px" ref="instance">
    <div class="mt-20px flex gap-10px">
      <slot name="outer"></slot>
      <div class="w-100%">
        <!-- 输入框 -->
        <my-search-account
          type="textarea"
          v-model="comment"
          :autosize="{ minRows: 2, maxRows: 4 }"
          show-word-limit
          :maxlength="maxCounts"
          :minlength="minCounts"
          @focus="commentFocus"
          @blur="isFocus = false"
          @input="handlerCounts"
          @paste="handlerPaste"
          @click="updateCursorPosition"
          @select="updateCursorPosition"
          ref="textAreaInstance"
          v-bind="$attrs"
        ></my-search-account>
        <!-- 文本框下的 工具栏 -->
        <div v-show="isShowTools" class="my-10px flex justify-between">
          <!-- 左侧 按钮 -->
          <div class="tool-btns">
            <i
              class="i-clarity:picture-line mt-1px ml-[-0.5px]"
              @click="handlerUpload"
            ></i>
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
              type="default"
              class="h-30px rounded-5px"
              size="small"
              @click="handlerImg"
              >批量替换图片</my-button
            >
            <slot name="btns"></slot>
          </div>
        </div>
        <!-- 渲染 评论 -->
        <vditor-preview
          v-model:article="previewComment"
          :isExportHtml="false"
          :autoPreview="true"
          v-if="isPreview"
        ></vditor-preview>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="AddArticleCommentsBase">
// 监听器 hook
import { useEventListener } from "@/hooks/useEventListener"
// 处理 特殊字符 正则替换
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 引入 交叉传感器
import { createIntersectionObserver } from "@/utils/observer"
// 处理 文件上传
import {
  clickUpload,
  clickUploadNameMapType,
  fileToImgMd,
  nameToMdImg,
  tempFileUpload,
} from "@/utils/upload"
// 节流
import throttle from "@/utils/throttle"
// 替换的 文本中 图片的 函数
import { contextImgToLink } from "@/hooks/Doc/vditorEditor/contextImgToLink"

import { mitt } from "@/utils/emitter"

const props = defineProps<{
  // 文章id
  articleId?: number
  settingId?: number
  isFixed?: boolean
  // 左右padding
  pl?: number
  pr?: number
}>()

let stopObserver: (() => void) | void
onBeforeUnmount(() => stopObserver?.())

// 组件 实例
const instance = ref<HTMLElement>()
let rect: DOMRect | null = null
onMounted(() => {
  const dom = instance.value
  // 传入 需要固定的 才固定
  if (props.isFixed && dom) {
    const handlerFixed = (isEnter: boolean) => {
      // 非空判断
      if (!dom) return
      // 固定
      if (isEnter) {
        if (!rect) rect = dom.getBoundingClientRect()
        if (rect.top > 0) return
        dom.classList.add("fixed-top")
        let left = rect.left
        let width = rect.width
        if (props.pl && props.pr) {
          left = left - props.pl
          width = width + props.pl + props.pr
        }
        dom.style.left = left + "px"
        dom.style.bottom = 0 + "px"
        dom.style.width = width + "px"
        return
      }
      // 取消 固定
      dom.classList.remove("fixed-top")
      dom.style.left = "initial"
      dom.style.bottom = "initial"
      dom.style.width = "initial"
    }
    mitt.on("chatisEnter", handlerFixed)
    // 使用 交叉传感器 监听 分割线
    stopObserver = createIntersectionObserver(dom, {
      leave: () => {
        const rect = dom.getBoundingClientRect()
        if (rect.top < 0) mitt.emit("chatisEnter", true)
      },
    })
    onBeforeUnmount(() => {
      mitt.off("chatisEnter", handlerFixed)
    })
  }
})
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
const minCounts = 20

// 输入框 的实例
const textAreaInstance = ref()
// 保存的操作
const saveToHistory = () => textAreaInstance.value?.saveToHistory?.()

// 输入框 聚焦 事件
const commentFocus = () => {
  isFocus.value = true
  isShowTools.value = true
}

// 判断 是否 是 有图片等信息
// 处理 maxcount
const handlerCounts = () => {
  comment.value = comment.value?.trim?.()
  const reg = /!\[.*?\]\(.*?\)/
  maxCounts.value = reg.test(comment.value)
    ? initialMaxCounts
    : initialMinCounts
}
// 是否 选中文本
const isSelected = ref(false)
// 选中 区域
const selection = reactive({
  start: 0,
  end: 0,
})

// 更新 光标位置信息
const updateCursorPosition = () => {
  // 得到 子组件 暴露的 方法 的 textarea 元素
  const textarea = textAreaInstance.value.instance.textarea
  if (!textarea) return
  selection.start = textarea.selectionStart
  selection.end = textarea.selectionEnd
  isSelected.value = selection.start !== selection.end
}

// 更新 光标位置信息
watch(
  () => comment.value,
  // 更新光标信息
  updateCursorPosition,
  { flush: "post" } // 等同于nextTick
)

// 处理 插入文本的信息
const insertText = (context: string) => {
  saveToHistory() // 保存操作前的状态

  const instance = textAreaInstance.value?.instance
  const textarea = instance?.textarea
  if (!textarea) return

  const selection = {
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  }

  // 执行插入/替换
  comment.value =
    comment.value.substring(0, selection.start) +
    context +
    comment.value.substring(selection.end)

  // 计算新光标位置
  const newCursorPos = selection.start + context.length

  // 异步更新光标
  nextTick(() => {
    textarea.setSelectionRange(newCursorPos, newCursorPos)
    saveToHistory() // 保存操作后的状态
  })
}

// 监听 输入框的 粘贴事件
const handlerPaste = async (e: ClipboardEvent) => {
  if (!e.clipboardData) return
  e.preventDefault()
  const items = e.clipboardData.items
  for (const item of items) {
    // 本地 图片
    if (item.type.startsWith("image/")) {
      // 处理本地粘贴的图片
      const file = item.getAsFile()
      if (file) {
        // 处理文本信息
        await upload({ virtual: false, files: [file] })
      }
      return
    }
    // 文本信息
    if (item.type === "text/plain") {
      // 处理粘贴的文本（可能是网络图片 URL）
      item.getAsString(async (text) => {
        // if (isUrl(text)) {
        //   insertText(nameToMdImg(text))
        //   // 提示时 替换链接 为 临时链接
        //   await handlerImg(false)
        //   ElMessage.success("图片上传成功")
        // } else {
        //   insertText(text)
        // }
        insertText(text)
      })
    }
  }
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

// 处理 点击文件的 上传 图片
const handlerUpload = async () => await upload()
const upload = async (options?: { virtual?: boolean; files?: File[] }) => {
  const virtual = options?.virtual ?? true
  const files = options?.files
  try {
    if (virtual) {
      const { files, nameMap } = await clickUpload()
      const mdUrl = fileToImgMd(files)
      // 更新 值
      insertText(mdUrl)
      handlerSuccessFile(files, nameMap)
      return
    }
    if (!files) return
    const mdUrl = fileToImgMd(files)
    // 更新 值
    insertText(mdUrl)
    handlerSuccessFile(files)
  } catch (error) {
    console.error("评论区上传图片出错", error)
  }
}

const handlerSuccessFile = async (
  files: File[],
  nameMap?: clickUploadNameMapType
) => {
  const result = await tempFileUpload(files, {
    errorCallback: (name) => {
      const errorName = nameMap?.[name] || name
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

    saveToHistory() // 保存操作前的状态
    // 更新
    if (commentContent !== comment.value) comment.value = commentContent
    nextTick(saveToHistory) // 保存操作前的状态

    // 重新 计算 最大值
    handlerCounts()
    // 聚焦文本框
    nextTick(() => {
      textAreaInstance.value?.instance?.focus?.()
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

  saveToHistory() // 保存操作前的状态
  // 更新
  if (commentContent !== comment.value) comment.value = commentContent
  nextTick(saveToHistory) // 保存操作前的状态

  // 重新 计算 最大值
  handlerCounts()
  ElMessage.success("上传图片成功")
  // 聚焦文本框
  nextTick(() => {
    textAreaInstance.value?.instance?.focus?.()
  })
}

// 批量替换 网络图片
const handlerImg = throttle(async (tip: boolean = true) => {
  saveToHistory() // 保存操作前的状态
  const result = await contextImgToLink(comment.value, tip)
  if (result) comment.value = result
  nextTick(saveToHistory) // 保存操作前的状态
}, 1000)

// 增加 评论
const validate = () => {
  const id = props.articleId || props.settingId
  // 验证 信息
  if (!id) {
    console.error("发布评论失败，没有id")
    ElMessage.warning("发布评论失败，没有id")
    return
  }
  if (props.articleId && props.settingId) {
    console.error("发布评论失败，id冲突")
    ElMessage.warning("发布评论失败，id冲突")
    return
  }

  // 判断 字数是否 符合
  const len = comment.value.trim().length
  if (len < minCounts || len > maxCounts.value) {
    ElMessage.warning(`评论字数需要在:${minCounts}到${maxCounts.value}之间哦`)
    return
  }
  return true
}

// 重置
const reset = () => {
  saveToHistory()
  comment.value = ""
  saveToHistory()
}
// 重新赋值 不保存
const clearSetValue = (value: string) => {
  comment.value = value || ""
}

// 把 输入框暴露出去
defineExpose({
  textAreaInstance,
  validate,
  saveToHistory,
  reset,
  clearSetValue,
  comment: () => comment.value,
})
</script>

<style lang="scss">
body[banner-fixed="fixed"] {
  .add-comments {
    &.fixed-top {
      box-shadow: 0 -1px 3px var(--primary-shadow-color-fixed);
    }
  }
}
</style>
<style scoped lang="scss">
.add-comments {
  &.fixed-top {
    position: fixed;
    height: fit-content;
    border-radius: 10px;
    padding: 10px;
    z-index: 20;
    background-color: var(--primary-card-bg);
    box-shadow: 0 -1px 3px var(--primary-shadow-color);
  }
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
  ::v-deep(.vditor-style) {
    margin-right: 5px;
  }
}
</style>
