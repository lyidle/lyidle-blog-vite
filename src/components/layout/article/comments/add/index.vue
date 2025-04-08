<template>
  <layout-article-comments-base ref="instance">
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
import { getPersistedData } from "@/utils/crypto/crypto-aes"
import { GetFollowUser } from "@/api/user/follow/types/getFollowUser"
import { findByAccount } from "@/api/user"
import { saveUsersWithDeduplication } from "@/utils/saveUsersWithDeduplication"

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
  reqComments?: () => void
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
const validate = () => {
  // 验证内容长度
  if (!instance.value.validate()) return
  // 其他验证信息
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
  return true
}

const route = useRoute()
/**
 * 从文本中全局提取所有[@...]标签的内容
 * @param text 要提取的文本
 * @returns 包含所有匹配内容的数组，如果没有匹配则返回空数组
 */
const extractAllAtTags = (text: string): string[] | null => {
  const matches = text.matchAll(/\[@([^\]]+)\]/g)
  const result = Array.from(matches, (match) => match[1])
  return result.length ? result : null
}
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
      // 记录当前页面的地址信息
      link: route.path || null,
    }
    const content = comment()
    // 提取是否有at的人
    const atArr = extractAllAtTags(content)
    // 有at的人
    if (atArr) {
      // 获取本地已有用户数据
      const localUsers = getPersistedData(
        "atUserSearchs"
      ) as GetFollowUser["data"]["users"]

      const userIdsSet = new Map<string, number>()

      // 保存还需要搜索的account
      const searchAccountSet = new Set()

      // 判断是否存在
      if (localUsers && Array.isArray(localUsers)) {
        for (const account of atArr) {
          // 拥有 了 account 跳过
          if (userIdsSet.get(account)) continue
          // 查找到对应的 at的 userId
          const findAccount = localUsers.find(
            (item) => item.account === account
          )
          // 找到则保存id
          if (findAccount) userIdsSet.set(account, findAccount.id)
          // 没找到则 添加需要搜索的
          else {
            searchAccountSet.add(account)
          }
        }
      } else {
        atArr.forEach((account) => searchAccountSet.add(account))
      }
      // 得到 还需要搜索的 账户
      const searchAccount = Array.from(searchAccountSet) as string[]
      searchAccountSet.clear()
      // 并行处理 搜索account 得到 id
      await Promise.allSettled(
        searchAccount.map(async (account) => {
          if (userIdsSet.get(account)) return
          const find = await findByAccount(account)
          if (find) {
            userIdsSet.set(account, find.id)
            // 保存用户数据到本地缓存（自动去重）
            saveUsersWithDeduplication([find] as GetFollowUser["data"]["users"])
          }
        })
      )

      // 得到 at的 id值
      const userIds = Object.values(Object.fromEntries(userIdsSet))
      // 添加at的数据id
      updateBody.mentionsUserIds = userIds
      userIdsSet.clear()
    }
    props?.addComments?.(updateBody)
    await useMdReplaceImg(content, updateBody, {
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
