// 引入 api
import { postImgPermanent } from "@/api/img"
// 压缩
import { compressString } from "@/utils/compression"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 替换 md的 临时链接
export const useMdReplaceImg = async (
  content: string,
  data: any,
  options?: { key?: string; path?: string }
) => {
  let contentKey = "content"
  let path = "/md/content"
  if (options) {
    let { key: optKey, path: optPath } = options
    if (optPath) path = optPath
    if (optKey) contentKey = optKey
  }
  // 引入前缀
  const prefix = import.meta.env.VITE_API

  // 将 prefix 中的 / 替换为 \
  const normalizedPrefix = prefix.replace(/\//g, "\\")

  // 处理临时链接
  let match: RegExpExecArray | null
  const urls = new Set<string>()

  // 判断有无值
  if (content) {
    // 构建正则表达式，支持正斜杠和反斜杠
    const urlRegex = new RegExp(
      `!\\[.*?\\]\\(([\\\\/]${normalizedPrefix}[\\\\/]assets[\\\\/]images[\\\\/]temp.*)\\)`,
      "g"
    )
    // 使用循环查找所有匹配项
    while ((match = urlRegex.exec(content)) !== null) {
      if (match.index === urlRegex.lastIndex) {
        urlRegex.lastIndex++
      }
      urls.add(match[1])
    }
  }

  const arr = Array.from(urls)
  urls.clear()

  let transformLink = ""

  // 判断有无临时 链接
  if (arr.length) {
    data.tempImg = arr
    transformLink = (await useMdImgToLinkPermanent(arr, content, path)) || ""
    data[contentKey] = compressString(transformLink || "") || ""
  }
  // 没有 临时的 直接压缩
  if (!transformLink) {
    data[contentKey] = compressString(content || "") || ""
  }
}
// 转换 临时链接为永久
export const useMdImgToLinkPermanent = async (
  tempImg: string[],
  content: string,
  path: string
) => {
  const { userAccount } = storeToRefs(useUserStore())
  if (!userAccount.value) {
    ElMessage.error("临时的图片转永久链接需要登录~")
    return
  }

  try {
    const result = await postImgPermanent({
      tempImg,
      account: userAccount.value,
      path: path,
    })
    if (result) {
      const { successImg, tempImgNull } = result
      // 临时图片失效的
      if (tempImgNull.length) {
        tempImgNull.forEach((item) => {
          ElMessage.warning({
            message: `临时图片:${item}不存在~`,
            customClass: "selectMessage",
          })
        })
      }
      if (successImg.length) {
        // 用于生成正则 替换用
        let origins = successImg
          .map((item: any) => escapeUrlForRegExp(item.origin))
          .join("|")
        const reg = new RegExp(origins, "g")
        // 替换文本
        const result = content.replace(reg, (matched) => {
          const item = successImg.find((img) => img.origin === matched)
          if (item) {
            // 确保 URL 中的路径分隔符为正斜杠
            let url = item.url.replace(/\\/g, "/")
            return url
          }
          return matched // 如果没有找到匹配的项，则返回原匹配字符串（或根据需要处理）
        })
        return result
      }
    }
  } catch (error) {
    ElMessage.warning("临时图片转为永久链接失败~")
  }
}
