// 引入 Vditor
import Vditor from "vditor"
// 图片转临时链接
import { imgToTempLink } from "../imgToTempLink"
// 基础配置项
import { baseOptions } from "../baseOptions"

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
  const { docHeight, context, length } = RefOptions
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
        imgToTempLink(vditor as Ref<Vditor>),
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
      // 控制高度
      resize: {
        enable: true,
        // 缓存 高度
        after: () => {
          docHeight.value = vditorEditor.value.offsetHeight + "px"
        },
      },
    })
  }

  const Mounted = () => {
    // 加载编辑器
    editor()
  }
  const UnMounted = () => {
    // 销毁
    vditor.value?.destroy()
    unMountedOptions?.()
  }

  // 返回 vditor 实例对象
  return { vditor, Mounted, UnMounted }
}
