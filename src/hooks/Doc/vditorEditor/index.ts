// 引入 Vditor
import Vditor from "vditor"
import "vditor/dist/index.css"
// 引入 仓库
import { useDocEditorOpt } from "@/store/doc"
import { useSettingStore } from "@/store/setting"
import { useUserStore } from "@/store/user"
// 引入 添加 高亮 和 callotus 的函数
import { addHighlightAndCallouts } from "@/utils/doc/addHighlightAndCallouts"
import { mitt } from "@/utils/emitter"
// 引入 api
import { postTempImgUrl, postTempImg } from "@/api/img"
// 引入前缀
const prefix = import.meta.env.VITE_API
export const useVditorEditor = (vditorEditor: Ref<HTMLDivElement>) => {
  // 提取数据
  const { isDark } = storeToRefs(useSettingStore())
  const { docHeight, context } = storeToRefs(useDocEditorOpt())
  const { userToken } = storeToRefs(useUserStore())
  let vditor: null | Vditor = null

  const editor = () => {
    vditor = new Vditor("vditor-preview", {
      height: docHeight.value,
      value: context.value,
      // 默认模式 是 所见即所得
      mode: "wysiwyg",
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
      // 工具栏
      toolbar: [
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        // "upload",
        // imgTo link
        {
          name: "imgToBase64",
          tip: "把所偶图片转成base64",
          tipPosition: "n",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M7 9H3q-.425 0-.712-.288T2 8t.288-.712T3 7h4V4.85l-.875.875q-.3.3-.712.288T4.7 5.7q-.275-.3-.288-.7t.288-.7l2.6-2.6q.3-.3.7-.3t.7.3l2.6 2.6q.3.3.287.7t-.287.7q-.3.3-.712.313t-.713-.288L9 4.85V15h12q.425 0 .713.288T22 16t-.288.713T21 17h-4v2.15l.875-.875q.3-.3.713-.288t.712.313q.275.3.288.7t-.288.7l-2.6 2.6q-.3.3-.7.3t-.7-.3l-2.6-2.6q-.3-.3-.287-.7t.287-.7q.3-.3.713-.312t.712.287l.875.875V17H9q-.825 0-1.412-.587T7 15zm8 4V9h-4V7h4q.825 0 1.413.588T17 9v4z"/></svg>',
          click: async (e, $vditor) => {
            // 获取 md的信息
            const value = vditor?.getValue()
            let match: RegExpExecArray | null
            const urls = new Set<string>()
            // 判断有无值
            if (value) {
              const urlRegex = /!\[.*?\]\((.*?)\)/g
              // 使用循环查找所有匹配项
              while ((match = urlRegex.exec(value)) !== null) {
                if (match.index === urlRegex.lastIndex) {
                  urlRegex.lastIndex++
                }
                // 排除掉处理后的
                if (!match[1].startsWith(prefix.replace("/", "\\")))
                  urls.add(match[1])
              }
            }
            const arr = Array.from(urls)
            urls.clear()
            // 保存 处理好的图片
            let result = []
            // 存在 且 为1 发起请求 处理图片
            if (arr.length) {
              // 遍历添加 处理结果
              for (const item of arr) {
                try {
                  const handler = await postTempImg(item)
                  if (handler?.url) {
                    result.push({
                      url: handler?.url,
                      origin: handler?.origin,
                    })
                  }
                } catch (error) {}
              }
            }

            //
            let Origins = ""
            let Urls = ""

            result.forEach((item, index) => {
              Origins += `${index > 0 ? "|" : ""}${item.origin.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              )}` // 转义特殊字符并拼接
              Urls += `${index > 0 ? "|" : ""}${item.url}` // 拼接目标 URL
            })

            // 构造正则表达式匹配多个 origin
            const reg = new RegExp(Origins, "g")

            // 替换 value 中的 origin 为对应的 url
            const contentValue = value?.replace(reg, (matched) => {
              // 根据匹配的 origin 找到对应的 url
              const index = result.findIndex((item) => item.origin === matched)
              return result[index]?.url || matched // 替换为对应 url 或保持原值
            })

            // 处理完后 替换 内容
            if (contentValue) vditor?.setValue(contentValue)
          },
        },
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode",
        {
          name: "more",
          toolbar: [
            {
              name: "export",
            },
            "outline",
            "help",
          ],
        },
      ],
      cache: { enable: false },
      // 缓存 值 到仓库
      // input(value) {
      //   context.value = value
      // },
      upload: {
        // 直接 上传图片的接口
        linkToImgUrl: postTempImgUrl,
        // 直接 上传图片的接口 处理返回结果 适配 vditor
        linkToImgFormat: ($res: string): string => {
          const res = JSON.parse($res)
          const { data, message } = res
          const result: any = {
            code: res.code,
            msg: message,
            data: {
              originalURL: data?.origin,
              url: data?.url,
            },
          }

          if (res.code == 401) {
            ElMessage.warning("没有权限转换图片~")
            return JSON.stringify({ data: {} })
          }

          if (res.code !== 200 && res.code !== 401) {
            ElMessage.warning("转换图片url失败~")
            return JSON.stringify({ data: {} })
          }

          // 成功的代码是 0 才能插入 链接
          result.code = 0

          const finall = JSON.stringify(result)
          return finall
        },
        headers: { Authorization: `Bearer ${userToken.value}` },
        accept: "image/*",
        max: 5 * 1024 * 1024,
        url: postTempImgUrl,
        multiple: false,
        format: (files, res) => {
          console.log(files, res)
          return res
        },
      },
      // 控制高度
      resize: {
        enable: true,
        // 缓存 高度
        after: () => {
          docHeight.value = vditorEditor.value.offsetHeight
        },
      },
      // 关闭 评论
      comment: { enable: false },
      // 计数 模式为 text
      counter: {
        enable: true,
        type: "text",
      },
    })
  }

  // 监听 暗夜 变化
  mitt.on("isDark", (newV) => {
    vditor?.setTheme("classic", "light", newV ? "github-dark" : "github")
  })

  // 加载
  onMounted(() => {
    // 加载编辑器
    editor()
  })

  // 卸载
  onBeforeUnmount(() => {})
}
