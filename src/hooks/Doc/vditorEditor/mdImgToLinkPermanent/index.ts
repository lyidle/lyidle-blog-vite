// 引入 api
import { postImgPermanent } from "@/api/img"
// 压缩
import { compressString } from "@/utils/compression"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 替换 md的 临时链接
export const useMdReplaceImg = async (content: string, data: any) => {
  // 引入 前缀
  const prefix = import.meta.env.VITE_API
  // 处理临时链接
  let match: RegExpExecArray | null
  const urls = new Set<string>()
  const api = prefix.replace("/", "\\")
  // 判断有无值
  if (content) {
    const urlRegex = new RegExp(
      `!\\[.*?\\]\\((\\\\${api}\\\\assets\\\\images\\\\temp([^)]*))\\)`,
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
    transformLink = (await useMdImgToLinkPermanent(arr, content)) || ""
    data.content = compressString(transformLink || "") || ""
  }
  // 没有 临时的 直接压缩
  if (!transformLink) {
    data.content = compressString(content || "") || ""
  }
}
// 转换 临时链接为永久
export const useMdImgToLinkPermanent = async (
  tempImg: string[],
  content: string
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
      path: "/md/content",
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
