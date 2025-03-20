// 引入mitt
import { mitt } from "@/utils/emitter"
// 引入 Vditor
import Vditor from "vditor"
// 引入 类型
import type { TocNode } from "./types"
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
// 引入 仓库
import { useSettingStore } from "@/store/setting"

// 引入 添加 高亮 和 callotus 的函数
import { addCalloutsAndHighlightAndFillToSvg } from "@/utils/doc/addCalloutsAndHighlightAndFillToSvg"

export const useVditorPreview = (
  article: Ref<GetOneArticle["data"]>,
  menuTree: Ref<TocNode[] | undefined>,
  docPreview: Ref<HTMLDivElement | undefined>,
  observerHeading: (
    menuTree: Ref<TocNode[] | undefined>
  ) => (() => void) | undefined,
  autoPreview: boolean
) => {
  // 提取数据
  const { isDark } = storeToRefs(useSettingStore())

  // 生成目录树
  const addTree = (htmlString: string) => {
    // 将 HTML 字符串转换为 DOM 对象
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, "text/html")

    // 查询所有 h1-h6 标签
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    // 构造目录树
    const toc: TocNode[] = []
    const stack: Array<TocNode & { children: TocNode[] }> = [
      { level: 0, text: "", id: "", children: toc },
    ]
    // 初始化栈，包含一个虚拟根节点
    // 第一项 的 children 即真正目录树 同一个地址

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1)) // 获取 h1-h6 的等级
      const text = heading.textContent?.trim() || "" // 获取内容

      const id = heading.id || text.toLowerCase().replace(/\s+/g, "-") // 自动生成 ID
      heading.id = id // 设置 ID

      // 确保有 一个 children 来创建 地址的关联性
      const node: TocNode = { level, text, id, children: [] }

      // 确定节点的父级 while 循环 确保 最后一项是父级节点
      // 如 最后一个节点是 h2 当前节点是 h3 时
      // h3 >= h2 即删除 确保节点是 父节点
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }

      // 添加到父级的 children 中 添加到目录中
      stack[stack.length - 1].children.push(node)

      // 将当前节点压入栈
      // 需要确保 这一次的children 和 下一次 的 children 使用同一个地址
      stack.push({ ...node, children: node.children })
    })
    menuTree.value = toc
    // 把生成的目录 通知给 Content 来判断是否要显示目录 和 侧边栏
    mitt.emit("articleMenu", toc)
  }
  const resultHtml = ref("")
  let destroyHighlight: undefined | (() => void)
  // 渲染的回调函数
  const preview = () => {
    if (!article.value?.content || !docPreview.value) return

    Vditor.preview(docPreview.value, article.value.content, {
      theme: { current: "light" },
      //代码块
      hljs: {
        enable: true, // 启用代码高亮
        style: isDark.value ? "github-dark" : "github", //主题
        lineNumber: true, //行号
      },
      mode: "light", //模式
      anchor: 2, //编号的链接锚点
      // 转换之前 处理
      transform: (html: string) => {
        // 初始化 锚点
        // 用于 设置 颜色
        let result = addCalloutsAndHighlightAndFillToSvg(html)
        // 生成目录树
        addTree(result)
        resultHtml.value = result
        return result
      },
      after: () => {
        // 处理高亮逻辑
        if (!menuTree.value) return
        destroyHighlight = observerHeading(menuTree)
      },
    })
  }

  // 是否初始化了
  let isInitialized = false
  const stopWatch = watchEffect(() => {
    if (article.value?.content && docPreview.value) {
      preview()
      mitt.on("isDark", preview)
      if (autoPreview) return
      try {
        // 取消监听
        stopWatch()
      } catch (error) {
        // 初始化了
        isInitialized = true
      }
    }
  })
  // 在外部逻辑中调用 close
  if (isInitialized && !autoPreview) {
    // 取消监听
    stopWatch()
  }
  // 卸载
  onBeforeUnmount(() => {
    // 取消订阅 暗夜切换 事件
    mitt.off("isDark", preview)
    // 组件销毁时 通知 content 组件 把 isToc 复原 并销毁 监听
    mitt.emit("articleMenu:destroy", preview)
    destroyHighlight && destroyHighlight()
  })

  return resultHtml
}
