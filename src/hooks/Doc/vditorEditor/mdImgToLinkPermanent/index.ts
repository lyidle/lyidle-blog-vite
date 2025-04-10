// 引入 api
import { postImgPermanent } from "@/api/img"
// 压缩
import { compressString } from "@/utils/compression"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { contextReplaceUrls } from "@/RegExp/Url/replace/escapeUrlForRegExp"
import { SuccessImg } from "@/api/img/types/postImgPermanent"
// let path = "/md/content"
// 替换 md的 临时链接
export const useMdReplaceImg = async (
  content: string,
  data: any,
  options: { key?: string; path: string; isTidy?: boolean }
) => {
  // 是否 返回 text和图片成功和失败的数据
  const isTidy = options?.isTidy || false

  // 什么作为键 放到传入的 data中 处理加压缩完毕的 文本
  const contentKey = options.key || "content"
  // 放到什么路径
  const path = options.path

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
      `!\\[.*?\\]\\(([\\\\/]${normalizedPrefix}[\\\\/]assets[\\\\/]images[\\\\/]temp[\\\\/].*?)\\)`,
      "g"
    )
    // 使用循环查找所有匹配项
    while ((match = urlRegex.exec(content)) !== null) {
      if (match.index === urlRegex.lastIndex) {
        urlRegex.lastIndex++
      }
      const matched = match[1].replace(/[\\\\/]/g, "/").trim()
      if (matched) urls.add(matched)
    }
  }

  const arr = Array.from(urls)
  urls.clear()

  let transformLink = ""
  let handlered: useMdImgToLinkPermanentReturnType
  // 判断有无临时 链接
  if (arr.length) {
    data.tempImg = arr
    handlered = await useMdImgToLinkPermanent(arr, content, path, isTidy)
    // transformLink = result || ""
    if (typeof handlered === "string") transformLink = handlered
    if (typeof handlered === "object" && typeof handlered.text === "string")
      transformLink = handlered.text
    // 有值则压缩
    if (transformLink) {
      data[contentKey] = compressString(transformLink || "") || ""
    }
  }
  // 没有 临时的 直接压缩
  if (!transformLink) {
    data[contentKey] = compressString(content || "") || ""
  }
  return { handlered, content }
}
type useMdImgToLinkPermanentReturnType =
  | undefined
  | void
  | string
  | { text: string; successImg: SuccessImg[]; tempImgNull: string[] }
// 转换 临时链接为永久
export const useMdImgToLinkPermanent = async (
  tempImg: string[],
  content: string,
  path: string,
  isTidy: boolean
): Promise<useMdImgToLinkPermanentReturnType> => {
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
          })
        })
      }
      if (successImg.length) {
        if (!isTidy) return contextReplaceUrls({ successImg, content })
        else
          return {
            text: contextReplaceUrls({ successImg, content }),
            successImg,
            tempImgNull,
          }
      }
    }
  } catch (error) {
    ElMessage.warning("临时图片转为永久链接失败~")
  }
}

// 引入前缀
let prefix = import.meta.env.VITE_API
// 处理成 api 格式
prefix = prefix.replace(/[\/\\]/g, "")
/**
 * 提取文本中所有动态前缀（如 /api/assets 或 \custom\assets）的图片 URL
 * @param text 待处理的文本
 * @returns 匹配到的图片 URL 数组（统一转换为正斜杠）
 */
export const extractImageUrls = (
  text: string,
  cb?: (url: string) => string
): string[] => {
  // 动态生成正则表达式，匹配如 /api/assets 或 \custom\assets
  const dynamicReg = new RegExp(
    `!\\[.*?\\]\\(([\\/\\\\]?${prefix}[\\/\\\\]assets[^\\s)]*)\\)`,
    "gi"
  )

  const urls: string[] = []
  let match: RegExpExecArray | null

  while ((match = dynamicReg.exec(text)) !== null) {
    let url = match[1]
      .replace(/\\/g, "/") // 反斜杠转正斜杠
      .replace(/^\/+/, "/") // 确保开头只有一个正斜杠
    if (typeof cb === "function") urls.push(cb(url))
    else urls.push(url)
  }

  return urls
}

/**
 * 提取 `/api/assets/images` 之后的内容
 * @param text 文本
 * @returns 提取后的urls
 */
export const extractImgUrlsWithImg = (text: string) =>
  extractImageUrls(text, (url) => {
    const parts = url.split(`/${prefix}/assets/images/`)
    return parts.length > 1
      ? parts[1].startsWith("/")
        ? parts[1]
        : `/${parts[1]}`
      : url // 如果匹配失败，返回原 URL
  })
