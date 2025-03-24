// 引入api 图片 按钮批量 处理url的地址 接口是单个的
import { postTempImgUrl } from "@/api/img"
// 正则
import { isUrl } from "@/RegExp/Url/isUrl"
import { contextReplaceUrls } from "@/RegExp/Url/replace/escapeUrlForRegExp"

export const contextImgToLink = async (
  context: string,
  tip: boolean = true
): Promise<string | void> => {
  // 获取 md的信息
  const value = context
  if (!value?.trim()) {
    tip && ElMessage.warning("没有需要处理的图片")
    return
  }

  let match: RegExpExecArray | null
  const urls = new Set<string>()
  // 判断有无值
  const urlRegex = /!\[.*?\]\((.*?)\)/g
  // 使用循环查找所有匹配项
  while ((match = urlRegex.exec(value)) !== null) {
    if (match.index === urlRegex.lastIndex) {
      urlRegex.lastIndex++
    }

    // 得到 匹配项
    let cur = match[1]
    // 判断 是https还是 http
    const isHttp = cur.startsWith("http://") && "http://"
    const isHttps = cur.startsWith("https://") && "https://"
    const httpOrHttps = isHttp || isHttps
    // 存在
    if (httpOrHttps) {
      // 去掉 协议
      cur = cur.replace((isHttp as string) || (isHttps as string), "")
      // 替换 斜杠 加上 协议 去重处理
      cur = httpOrHttps + cur.replace(/[\\\\/]/g, "/")
      // 需要是一个url
      if (isUrl(cur)) urls.add(cur)
    }
  }

  const arr = Array.from(urls)

  urls.clear()

  // 如果数组为空，直接返回警告
  if (!arr.length) {
    tip && ElMessage.warning("没有需要处理的图片")
    return
  }

  // 使用 map 和 Promise.all 并发处理图片请求
  try {
    const handlers = await Promise.all(
      arr.map(async (item) => {
        try {
          const handler = await postTempImgUrl(item)
          if (handler?.url) {
            return {
              url: handler.url,
              origin: handler.origin,
            }
          }
        } catch (error) {
          ElMessage.warning(`转换${item}为链接失败~`)
          return null
        }
        ElMessage.warning(`转换${item}为链接失败~`)
        return null
      })
    )

    // 过滤掉 null 值
    let successImg = handlers.filter((item) => item !== null)
    if (!successImg.length) {
      tip && ElMessage.warning("没有需要处理的图片")
      return
    }

    const contentValue = contextReplaceUrls({
      successImg,
      content: value,
      isHttpsOrHttp: true,
    })

    // 处理完后替换内容
    tip && ElMessage.success("批量图片转链接成功~")
    // 返回内容
    return contentValue
  } catch (error) {
    ElMessage.warning("批量图片转链接失败~")
  }
}
