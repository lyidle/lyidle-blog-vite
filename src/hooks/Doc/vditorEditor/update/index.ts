// 引入 Vditor
import Vditor from "vditor"
import "vditor/dist/index.css"
// 引入 仓库
import { useSettingStore } from "@/store/setting"
import { useUserStore } from "@/store/user"
// 引入 添加 高亮 和 callotus 的函数
import { addHighlightAndCallouts } from "@/utils/doc/addHighlightAndCallouts"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
/* 
 文件 的上传地址 批量
 图片 的上传地址 单个
 图片 按钮批量 处理url的地址 接口是单个的

*/
import { tempImgFiles, tempImgUrl, postTempImgUrl } from "@/api/img"

// 引入 处理url字符的方法
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 引入 正则
import { isUrl } from "@/RegExp/Url/isUrl"
import throttle from "@/utils/throttle"

// 定义 配置项 Ref 存储 高度 内容 长度
type RefOptionsType = {
  docHeight: Ref<string>
  context: Ref<string>
  length: Ref<number>
}

export type vditorType = Ref<Vditor | null>

// 返回类型
export type vditorReturnType = {
  vditor: vditorType
  Mounted: () => void
  UnMounted: () => void
}
/**
 *
 * @param containerId 容器id
 * @param vditorEditor 容器ref
 * @param RefOptions 配置项 RefOptionsType
 * @returns vditor 实列对象
 */
export const useVditorUpdate = (
  containerId: string,
  vditorEditor: Ref<HTMLDivElement>,
  RefOptions: RefOptionsType
): vditorReturnType => {
  // 提取数据
  const { isDark } = storeToRefs(useSettingStore())
  const { docHeight, context, length } = RefOptions
  const { userToken } = storeToRefs(useUserStore())
  let vditor: vditorType = ref(null)

  const editor = () => {
    vditor.value = new Vditor(containerId, {
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
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode",
        // imgTo link
        {
          name: "imgToLink",
          tip: "批量上传图片",
          tipPosition: "n",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M11.678 20.271C7.275 21.318 4 25.277 4 30c0 5.523 4.477 10 10 10c.947 0 1.864-.132 2.733-.378m19.322-19.351c4.403 1.047 7.677 5.006 7.677 9.729c0 5.523-4.477 10-10 10c-.947 0-1.864-.132-2.732-.378M36 20c0-6.627-5.373-12-12-12s-12 5.373-12 12m5.065 7.881L24 20.924L31.132 28M24 38V24.462"/></svg>',
          click: throttle(async () => {
            // 获取 md的信息
            const value = vditor.value?.getValue()
            if (!value?.trim())
              return ElMessage.warning("没有需要处理的图片哦~")
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
              const contentValue = value?.replace(reg, (matched) => {
                // 根据匹配的 origin 找到对应的 url
                const index = result.findIndex(
                  (item) => item.origin === matched
                )
                return result[index]?.url || matched // 替换为对应 url 或保持原值
              })
              // 处理完后 替换 内容
              vditor.value?.setValue(contentValue)
              ElMessage.success("图片链接替换成功~")
            }
          }, 1000),
        },
        // more
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
      upload: {
        // 直接 上传图片的接口
        linkToImgUrl: tempImgUrl,
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
            result.code = 1 //失败
            ElMessage.warning("没有权限上传图片~")
            result.msg = "没有权限上传图片~"
          }

          if (res.code !== 200 && res.code !== 401) {
            result.code = 1 //失败
            result.msg = "上传图片失败"
            ElMessage.error("上传图片失败~")
          }

          if (result.code === 200)
            // 成功的代码是 0 才能插入 链接
            result.code = 0
          ElMessage.success("上传图片成功~")

          const finall = JSON.stringify(result)
          return finall
        },
        headers: { Authorization: `Bearer ${userToken.value}` },
        accept: "image/*", //只允许 image字段
        max: 5 * 1024 * 1024,
        url: tempImgFiles,
        format: (files, $res) => {
          // 解析后端返回的数据
          const res = typeof $res === "string" ? JSON.parse($res) : $res

          const result = {
            code: 0, // Vditor 成功状态码
            msg: res.message || "上传成功",
            data: {
              errFiles: res.data?.errFiles || [],
              succMap: res.data?.succMap || {},
            },
          }

          // 成功
          if (res.code === 200) {
            res.data?.errFiles?.forEach((item: string) =>
              ElMessage.error(`${item}上传失败~`)
            )
            for (const msg in res.data?.succMap) {
              ElMessage.success(`${msg}上传成功~`)
            }
            return JSON.stringify(result)
          }

          // 处理后端返回失败的情况
          const errorResult = {
            code: 1, // Vditor 失败状态码
            msg: res.message || "上传失败",
            data: {
              errFiles: files?.map((file) => file.name), // 全部作为失败文件
              succMap: {},
            },
          }

          errorResult.data.errFiles?.forEach((item) =>
            ElMessage.error(`${item}上传失败~`)
          )
          return JSON.stringify(errorResult)
        },
      },
      // 控制高度
      resize: {
        enable: true,
        // 缓存 高度
        after: () => {
          docHeight.value = vditorEditor.value.offsetHeight + "px"
        },
      },
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
    })
  }

  // 监听 暗夜 变化
  mitt.on("isDark", (newV) => {
    vditor.value?.setTheme("classic", "light", newV ? "github-dark" : "github")
  })

  const Mounted = () => {
    // 加载编辑器
    editor()
  }
  const UnMounted = () => {
    // 销毁
    vditor.value?.destroy()
  }

  // 返回 vditor 实例对象
  return { vditor, Mounted, UnMounted }
}
