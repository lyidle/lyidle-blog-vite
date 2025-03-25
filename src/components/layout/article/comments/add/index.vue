<template>
  <layout-article-comments-base :articleId :settingId ref="instance">
    <template #outer>
      <!-- 头像 -->
      <global-avatar
        :isCenter="false"
        :isTo="false"
        :isCursor="false"
        style="--avatar-size: 50px"
      ></global-avatar>
    </template>
    <template #btns>
      <my-button
        class="h-30px rounded-5px"
        size="small"
        @click="addArticleComments"
        >{{ btnName ?? "发布" }}</my-button
      >
    </template>
  </layout-article-comments-base>
</template>

<script setup lang="ts" name="AddArticleComments">
// 引入 api
import { addComment } from "@/api/comments"
// 引入 类型
import type { AddCommentBody } from "@/api/comments/types/addCommentBody"
// 替换 文本里的 图片为永久 链接
import { useMdReplaceImg } from "@/hooks/Doc/vditorEditor/mdImgToLinkPermanent"
import { handlerReqErr } from "@/utils/request/error/successError"

// 引入 UAParser
import { UAParser } from "ua-parser-js"

// 引入 仓库
import { useAnnounceStore } from "@/store/announce"

// 提取需要的
const {
  // 展示的数据
  region_city,
  region_province,
} = storeToRefs(useAnnounceStore())
const { reqAnnounce } = useAnnounceStore()

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

onMounted(() => {
  // 延迟 500 毫秒 如果还没有 公告 相关信息 则 重新获取
  if (!region_city.value)
    setTimeout(async () => {
      if (region_city.value) return
      await reqAnnounce()
    }, 500)
})

const props = defineProps<{
  // 文章id
  articleId?: number
  settingId?: number
  //  请求评论的接口
  reqComments: () => void
  // 添加评论的回调
  addComments?: (updateBody: AddCommentBody) => void
  btnName?: string
}>()

const instance = ref()
defineExpose({ instance })
// 得到 内容
const comment = () => instance.value.comment() as string
// 重置 内容
const reset = () => instance.value.reset()
// 验证 内容
const validate = () => instance.value.validate()

// 增加 评论
const addArticleComments = async () => {
  // 验证 内容
  if (!validate()) return
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
    await useMdReplaceImg(comment(), updateBody, {
      path: "/comments",
    })
    // 添加 评论
    await addComment(updateBody)
    // 重置输入框
    reset()
    ElMessage.success("添加评论成功~")
    // 重新 请求数据
    await props?.reqComments?.()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("添加评论失败~")
  }
}
</script>
