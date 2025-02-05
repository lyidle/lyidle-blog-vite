// 引入api 图片 按钮批量 处理url的地址 接口是单个的
import { postTempImgUrl } from "@/api/img"
// 正则
import { isUrl } from "@/RegExp/Url/isUrl"
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
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
      if (!value?.trim()) return ElMessage.warning("没有需要处理的图片哦~")
      let match: RegExpExecArray | null
      const urls = new Set<string>()
      // 判断有无值
      const urlRegex = /!\[.*\]\((.*)\)/g
      // 使用循环查找所有匹配项
      while ((match = urlRegex.exec(value)) !== null) {
        if (match.index === urlRegex.lastIndex) {
          urlRegex.lastIndex++
        }
        // 需要是一个url
        if (isUrl(match[1])) urls.add(match[1])
      }

      const arr = Array.from(urls)

      urls.clear()
      // 保存 处理好的图片
      let result = []

      // 存在 且 为1 发起请求 处理图片
      if (!arr.length) return ElMessage.warning("没有需要处理的图片哦~")
      // 遍历添加 处理结果
      for (const item of arr) {
        try {
          const handler = await postTempImgUrl(item)
          if (handler?.url) {
            result.push({
              url: handler?.url,
              origin: handler?.origin,
            })
          }
        } catch (error) {}
        // 处理 url
        const Origins = result
          .map((item) => escapeUrlForRegExp(item.origin))
          .join("|")

        // 没有需要处理的则退出
        if (!Origins) return ElMessage.warning("没有需要处理的图片哦~")

        // 构造正则表达式匹配多个 origin
        const reg = new RegExp(Origins, "g")

        // 替换 value 中的 origin 为对应的 url
        const contentValue = value?.replace(reg, (matched: string) => {
          // 根据匹配的 origin 找到对应的 url
          const index = result.findIndex((item) => item.origin === matched)
          return result[index]?.url || matched // 替换为对应 url 或保持原值
        })
        // 处理完后 替换 内容
        vditor.value?.setValue(contentValue)
        ElMessage.success("图片链接替换成功~")
      }
    }, 1000),
  }
}
