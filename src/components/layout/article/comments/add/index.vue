<template>
  <div class="add-comments pb-20px" ref="instance">
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
        :minlength="minCounts"
        @focus="commentFocus"
        @blur="isFocus = false"
        @input="handlerInput"
        @paste="handlerPaste"
        @click="updateCursorPosition"
        @select="updateCursorPosition"
        @keydown.ctrl.z.prevent="handleUndo"
        @keydown.ctrl.y.prevent="handleRedo"
        ref="textAreaInstance"
        v-bind="$attrs"
      ></my-input>
    </div>
    <!-- 文本框下的 工具栏 -->
    <div v-show="isShowTools" class="ml-70px my-10px flex justify-between">
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
        <my-button
          class="h-30px rounded-5px"
          size="small"
          @click="addArticleComments"
          >发布</my-button
        >
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
// 节流
import throttle from "@/utils/throttle"
// 替换的 文本中 图片的 函数
import { contextImgToLink } from "@/hooks/Doc/vditorEditor/contextImgToLink"

// 引入 UAParser
import { UAParser } from "ua-parser-js"

// 引入 仓库
import { useAnnounceStore } from "@/store/announce"
import { isUrl } from "@/RegExp/Url/isUrl"
import { mitt } from "@/utils/emitter"

// 提取需要的
const {
  // 展示的数据
  region_city,
  region_province,
} = storeToRefs(useAnnounceStore())
const { reqAnnounce } = useAnnounceStore()

const props = defineProps<{
  // 文章id
  articleId?: number
  settingId?: number
  //  请求评论的接口
  reqComments: () => void
  // 添加评论的回调
  addComments?: (updateBody: AddCommentBody) => void
  isFixed: boolean
}>()

onMounted(() => {
  // 延迟 500 毫秒 如果还没有 公告 相关信息 则 重新获取
  if (!region_city.value)
    setTimeout(async () => {
      if (region_city.value) return
      await reqAnnounce()
    }, 500)
})

const instance = ref<HTMLDivElement>()
// 传入 需要固定的 才固定
if (props.isFixed)
  mitt.on("chatisEnter", (options: { isEnter: boolean; rect?: DOMRect }) => {
    const { isEnter, rect } = options
    const dom = instance.value

    // 非空判断
    if (!dom) return
    // 固定
    if (isEnter) {
      // 非空判断
      if (!rect) return
      dom.classList.add("fixed-top")
      dom.style.left = rect.left + "px"
      dom.style.bottom = 0 + "px"
      dom.style.width = rect.width + "px"
      return
    }
    // 取消 固定
    dom.classList.remove("fixed-top")
    dom.style.left = "initial"
    dom.style.bottom = "initial"
    dom.style.width = "initial"
  })

// 创建解析器实例
const parser = new UAParser()
// 获取解析结果
const result = parser.getResult()
// 操作系统和浏览器信息
const systemVersion = `${result.os.name || ""} ${result.os.version || ""}`
const browserVersion = `${result.browser.name || ""} ${
  result.browser.version || ""
}`
const userAgent = `${systemVersion}|${browserVersion}`
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
// 撤销和重做
const handleRedo = () => textAreaInstance.value?.redo?.()
const handleUndo = () => textAreaInstance.value?.undo?.()

// 把 输入框暴露出去
defineExpose({ textAreaInstance })

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
// 输入框 输入 事件
const handlerInput = debounce(() => {
  saveToHistory()
  handlerCounts()
}, 500)

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
        if (isUrl(text)) {
          insertText(nameToMdImg(text))
          // 提示时 替换链接 为 临时链接
          await handlerImg(false)
          ElMessage.success("图片上传成功")
        } else {
          insertText(text)
        }
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

// 增加 评论
const addArticleComments = async () => {
  const id = props.articleId || props.settingId
  // 验证 信息
  if (!id) {
    console.error("评论区加载失败，没有id")
    return ElMessage.warning("评论区加载失败，没有id")
  }
  if (props.articleId && props.settingId) {
    console.error("评论区加载失败，id冲突")
    return ElMessage.warning("评论区加载失败，id冲突")
  }

  // 判断 字数是否 符合
  const len = comment.value.trim().length
  if (len < minCounts || len > maxCounts.value)
    return ElMessage.warning(
      `评论字数需要在:${minCounts}到${maxCounts.value}之间哦`
    )

  try {
    const updateBody: AddCommentBody = {
      // articleId 或者 settingId
      articleId: props.articleId,
      settingId: props.settingId,
      content: "",
      userProvince: region_province.value,
      userAgent,
    }
    props?.addComments?.(updateBody)
    await useMdReplaceImg(comment.value, updateBody, {
      path: "/comments",
    })
    // 添加 评论
    await addComment(updateBody)
    // 重置输入框
    comment.value = ""
    ElMessage.success("添加评论成功~")
    // 重新 请求数据
    await props?.reqComments?.()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("添加评论失败~")
    // 重新 请求数据
    await props?.reqComments?.()
  }
}

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
    background-color: var(--pages-card-bg);
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
    margin-left: 65px;
    margin-right: 5px;
  }
}
</style>
