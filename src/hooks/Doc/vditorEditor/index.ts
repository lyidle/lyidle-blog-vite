// 引入 Vditor
import Vditor from "vditor"
import "vditor/dist/index.css"
// 引入 配置信息
import { useDocEditorOpt } from "@/store/doc"
const { docHeight } = storeToRefs(useDocEditorOpt())

export const useVditorEditor = (vditorEditor: Ref<HTMLDivElement>) => {
  const editor = () => {
    new Vditor("vditor-preview", {
      height: docHeight.value,
      toolbar: [
        "emoji",
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
        "upload",
        "record",
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
            "both",
            "code-theme",
            "content-theme",
            "export",
            "outline",
            "help",
          ],
        },
      ],
      cache: {
        enable: true,
        id: "vditor-editor-cache",
        after: (height) => {},
      },
      resize: {
        enable: true,
        after: () => {
          docHeight.value = vditorEditor.value.offsetHeight
        },
      },
      counter: { enable: true, type: "markdown" },
    })
  }

  // 加载
  onMounted(() => {
    // 加载编辑器
    editor()
  })

  // 卸载
  onBeforeUnmount(() => {})
}
