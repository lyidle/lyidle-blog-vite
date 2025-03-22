// 引入 仓库
import { useSettingStore } from "@/store/setting"
// 引入 添加 高亮 和 callotus 的函数
import { addHighlightAndCallouts } from "@/utils/doc/addHighlightAndCallouts"
// 图片文件转临时链接
import { uploadImgTempFile } from "../uploadImgTempFile"
import { mitt } from "@/utils/emitter"
// 引入 类型
import type { vditorType } from "../update"
export const baseOptions = (
  vditor: vditorType,
  docHeight: Ref<number | string | undefined>,
  context: Ref<string | undefined>,
  length: Ref<number | undefined>
) => {
  // 提取数据
  const { isDark } = storeToRefs(useSettingStore())
  const options: IOptions = {
    // 高度
    height: docHeight.value,
    // 内容
    value: context.value,
    // 默认模式 是 所见即所得
    mode: "wysiwyg",
    // 预览
    preview: {
      // 主题设置
      theme: { current: `light` },
      //代码块
      hljs: {
        enable: true, // 启用代码高亮
        //主题
        style: isDark.value ? "github-dark" : "github",
        lineNumber: true,
        defaultLang: "html",
      },
      // 预览 的 转换
      transform: (html): string => {
        let result = addHighlightAndCallouts(html)
        return result
      },
    },
    // 缓存
    cache: { enable: false },
    // 关闭 评论
    comment: { enable: false },
    // 计数 模式为 text
    counter: {
      enable: true,
      type: "text",
      after(len) {
        // 赋值长度
        length.value = len
      },
    },
    // upload: uploadImgTempFile(),
  }
  const changeDark = (newV: boolean) => {
    vditor.value?.setTheme("classic", "light", newV ? "github-dark" : "github")
  }
  // 监听 暗夜 变化
  mitt.on("isDark", changeDark)
  // 销毁
  const unMountedOptions = () => {
    // 监听 暗夜 变化
    mitt.off("isDark", changeDark)
  }
  return { options, unMountedOptions }
}
