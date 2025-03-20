// 引入 Vditor
import Vditor from "vditor"
// 图片转临时链接
import { imgToTempLink } from "./imgToTempLink"
// 基础配置项
import { baseOptions } from "./baseOptions"
// 引入类型
import type { vditorType } from "./update"
import { exportHtmlFile } from "../export/exportHtml"
// 定义 配置项 Ref 存储 高度 内容 长度
type RefOptionsType = {
  docHeight: Ref<string | number | undefined>
  context: Ref<string | undefined>
  length: Ref<number | undefined>
  title?: Ref<string | undefined>
  isSaveBtn?: boolean
  toolbarHide?: boolean
  resizeHide?: boolean
}
/**
 *
 * @param containerId 容器id
 * @param vditorEditor 容器ref
 * @param RefOptions 配置项 RefOptionsType
 * @returns vditor 实列对象
 */
export const useVditorEditor = (
  containerId: string,
  vditorEditor: Ref<HTMLDivElement>,
  RefOptions: RefOptionsType
) => {
  // 提取数据
  const {
    docHeight,
    context,
    length,
    title,
    isSaveBtn,
    toolbarHide,
    resizeHide = true,
  } = RefOptions
  // vditor 实列
  let vditor: vditorType = ref(null)
  // 销毁配置项
  let unMountedOptions: (() => void) | undefined
  // 编辑器挂载函数
  const editor = () => {
    // 配置项
    const { options, unMountedOptions: $unMountedOptions } = baseOptions(
      vditor,
      docHeight,
      context,
      length
    )
    // 赋值销毁配置项
    unMountedOptions = $unMountedOptions
    // 保存 vditor
    vditor.value = new Vditor(containerId, {
      ...options,
      toolbarConfig: { hide: toolbarHide },
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
        // 保存文档
        isSaveBtn
          ? {
              name: "save",
              tip: "保存文档",
              tipPosition: "n",
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M6 4a2 2 0 0 1 2-2h10l4 4v10.2a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-2Z"/><path d="M10 2v4h6m2 12v-7h-8v7"/><path d="M18 22H4a2 2 0 0 1-2-2V6"/></g></svg>',
              click: () => {
                const content = vditor.value?.getValue()
                context.value = content as string
                ElMessage.success("保存文档成功~")
              },
            }
          : "|",
        // 重置文档
        {
          name: "save",
          tip: "重置文档",
          tipPosition: "n",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 2h4m-2 12v-4m-8 3a8 8 0 0 1 8-7a8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/></g></svg>',
          click: () => {
            context.value = ""
            vditor.value?.setValue("")
            ElMessage.success("重置文档成功~")
          },
        },
        imgToTempLink(vditor as Ref<Vditor>),
        // more
        {
          name: "more",
          tip: "更多",
          tipPosition: "n",
          toolbar: [
            "export",
            {
              name: "export-html",
              icon: "导出Html",
              click: () => {
                const html = vditor.value?.getHTML()
                if (!html) return
                const h1 = document.querySelector(
                  ".vditor-reset h1"
                ) as HTMLAnchorElement
                const Title = title?.value || h1?.innerText || "LyidleのBlog"
                exportHtmlFile(html, Title)
              },
            },
            "outline",
            "help",
          ],
        },
      ],
      // 控制高度
      resize: {
        enable: resizeHide,
        // 缓存 高度
        after: () => {
          docHeight.value = vditorEditor.value.offsetHeight + "px"
        },
      },
    })
  }
  // 加载
  onMounted(() => {
    // 加载编辑器
    editor()
  })

  // 卸载
  onBeforeUnmount(() => {
    vditor.value?.destroy()
    unMountedOptions?.()
  })

  // 返回 vditor 实例对象
  return vditor
}
