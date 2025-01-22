// 引入 Vditor
import Vditor from "vditor"
import "vditor/dist/index.css"
// 引入 仓库
import { useDocEditorOpt } from "@/store/doc"
import { useSettingStore } from "@/store/setting"

// 引入 添加 高亮 和 callotus 的函数
import { addHighlightAndCallouts } from "@/utils/doc/addHighlightAndCallouts"
import { mitt } from "@/utils/emitter"

export const useVditorEditor = (vditorEditor: Ref<HTMLDivElement>) => {
  // 提取数据
  const { isDark } = storeToRefs(useSettingStore())
  const { docHeight, context } = storeToRefs(useDocEditorOpt())
  let vditor: null | Vditor = null
  const editor = () => {
    vditor = new Vditor("vditor-preview", {
      height: docHeight.value,
      value: context.value,
      // 默认模式 是 所见即所得
      mode: "wysiwyg",
      preview: {
        // 主题设置
        theme: { current: "light" },
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
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode",
        {
          name: "more",
          toolbar: ["export", "outline", "help"],
        },
      ],
      // 缓存 值 到仓库
      input(value) {
        // 输入时转换 新增的语法 ==高亮文本== [!tip] callouts
        let result = addHighlightAndCallouts(value)
        context.value = result
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
      // 计数 模式为 markdown
      counter: {
        enable: true,
        type: "markdown",
        after: (length, counter) => {},
      },
    })
  }

  // 监听 暗夜 变化
  mitt.on("isDark", (newV) => {
    vditor?.setTheme("classic", "", newV ? "github-dark" : "github")
  })

  // 加载
  onMounted(() => {
    // 加载编辑器
    editor()
  })

  // 卸载
  onBeforeUnmount(() => {})
}
