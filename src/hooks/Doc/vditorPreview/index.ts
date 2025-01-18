// 引入mitt
import { mitt } from "@/utils/emitter"
// 引入 Vditor
import Vditor from "vditor"
import "vditor/dist/index.css"
// 引入 类型
import type { TocNode } from "./types"
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
// 引入 仓库
import { useSettingStore } from "@/store/setting"

export const useVditorPreview = (
  article: Ref<GetOneArticle["data"]>,
  menuTree: Ref<TocNode[]>,
  docPreview: Ref<HTMLDivElement | undefined>,
  observerHeading: (menuTree: Ref<TocNode[]>) => (() => void) | undefined
) => {
  // 提取数据
  const { isDark } = storeToRefs(useSettingStore())

  // 正则 svg 添加 属性 fill="currentColor"
  const addFillToSVG = (htmlString: string): string => {
    return htmlString.replace(/<svg([^>]*)>/g, (match, attributes) => {
      // 如果已经存在 fill 属性，跳过添加
      if (/fill=/.test(attributes)) {
        return match
      }
      // 添加 fill="currentColor"
      return `<svg${attributes} fill="currentColor">`
    })
  }

  // 给 blockquote 添加 type 以实现 callouts
  const addTypeToBlockquote = (htmlString: string): string => {
    return htmlString
      .replace(
        /<blockquote([^>]*)>\s*<p>\[!([^\]]+)\]/g,
        (match, attributes, tipType) => {
          // 包裹 [!type] 的部分为 <span> 元素
          const wrappedTip = `<span class="callouts">[!${tipType}]</span><p>`
          // 检查是否已存在 type 属性
          if (/type=/.test(attributes)) {
            return match.replace(/<p>\[!([^\]]+)\]/, wrappedTip) // 替换 [!type]
          }
          // 添加 type 属性并替换 [!type]
          return `<blockquote${attributes} type="${tipType}">${wrappedTip}`
        }
      )
      .replace(
        /<blockquote>\s*<p>/g,
        '<blockquote type="default"><p><span class="callouts">[!default]</span>'
      )
  }

  // 给 markdown 添加 高亮显示 ==高亮文本==
  const addHighlight = (htmlString: string): string => {
    return htmlString.replace(
      /==(.+?)==/g,
      "<span class='doc-highlight'>$1</span>"
    )
  }

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
        let result = addFillToSVG(html)
        // 给 blockquote 添加 type 以实现 callouts
        result = addTypeToBlockquote(result)
        // 给 markdown 添加 高亮显示 ==高亮文本==
        result = addHighlight(result)
        // 生成目录树
        addTree(result)
        return result
      },
      after: () => {
        // 处理高亮逻辑
        destroyHighlight = observerHeading(menuTree)
      },
    })
  }

  // 等内容加载后渲染
  const close = watch(
    () => article.value?.content,
    (newV) => {
      // 渲染 文章
      if (newV) {
        preview()
        // 订阅 暗夜切换 事件
        mitt.on("isDark", preview)
        close()
      }
    }
  )

  // 卸载
  onBeforeUnmount(() => {
    // 取消订阅 暗夜切换 事件
    mitt.off("isDark", preview)
    // 组件销毁时 通知 content 组件 把 isToc 复原 并销毁 监听
    mitt.emit("articleMenu:destroy", preview)
    destroyHighlight && destroyHighlight()
  })
}
