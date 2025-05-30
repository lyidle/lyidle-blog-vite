import Vditor from "vditor"
// 节流
import throttle from "@/utils/throttle"
// 替换的 文本中 图片的 函数
import { contextImgToLink } from "../contextImgToLink"

export const imgToTempLink = (vditor: Ref<Vditor>) => {
  return {
    name: "imgToLink",
    tip: "批量上传图片",
    tipPosition: "n",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M11.678 20.271C7.275 21.318 4 25.277 4 30c0 5.523 4.477 10 10 10c.947 0 1.864-.132 2.733-.378m19.322-19.351c4.403 1.047 7.677 5.006 7.677 9.729c0 5.523-4.477 10-10 10c-.947 0-1.864-.132-2.732-.378M36 20c0-6.627-5.373-12-12-12s-12 5.373-12 12m5.065 7.881L24 20.924L31.132 28M24 38V24.462"/></svg>',
    click: throttle(async () => {
      const context = vditor.value?.getValue()
      const result = await contextImgToLink(context)
      if (result) vditor.value.setValue(result)
    }, 1000),
  }
}
