// 引入api 图片 按钮批量 处理url的地址 接口是单个的
import { postTempImgUrl } from "@/api/img"
// 正则
import { isUrl } from "@/RegExp/Url/isUrl"
import {
  contextReplaceUrls,
  escapeUrlForRegExp,
} from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 节流
import throttle from "@/utils/throttle"
import Vditor from "vditor"

export const imgToTempLink = (vditor: Ref<Vditor>) => {
  return {
    name: "imgToLink",
    tip: "批量上传图片",
    tipPosition: "n",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M11.678 20.271C7.275 21.318 4 25.277 4 30c0 5.523 4.477 10 10 10c.947 0 1.864-.132 2.733-.378m19.322-19.351c4.403 1.047 7.677 5.006 7.677 9.729c0 5.523-4.477 10-10 10c-.947 0-1.864-.132-2.732-.378M36 20c0-6.627-5.373-12-12-12s-12 5.373-12 12m5.065 7.881L24 20.924L31.132 28M24 38V24.462"/></svg>',
    click: throttle(async () => {
      // 获取 md的信息
      const value = vditor.value?.getValue()
      if (!value?.trim()) return ElMessage.warning("没有需要处理的图片")

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
        // 都不存在 退出
        if (!httpOrHttps) return
        // 去掉 协议
        cur = cur.replace((isHttp as string) || (isHttps as string), "")
        // 替换 斜杠 加上 协议 去重处理
        cur = httpOrHttps + cur.replace(/[\\\\/]/g, "/")
        // 需要是一个url
        if (isUrl(cur)) urls.add(cur)
      }

      const arr = Array.from(urls)

      urls.clear()

      // 如果数组为空，直接返回警告
      if (!arr.length) return ElMessage.warning("没有需要处理的图片")

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
          ElMessage.warning("没有需要处理的图片")
          return
        }

        const contentValue = contextReplaceUrls({
          successImg,
          content: value,
          isHttpsOrHttp: true,
        })

        // 处理完后替换内容
        vditor.value?.setValue(contentValue)
        ElMessage.success("批量图片转链接成功~")
      } catch (error) {
        ElMessage.warning("批量图片转链接失败~")
      }
    }, 1000),
  }
}
