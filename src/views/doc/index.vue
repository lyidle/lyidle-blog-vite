<template>
  <layout-header />
  <layout-banner :context="false"></layout-banner>
  <layout-content>
    <!-- 侧边栏 -->
    <template #aside-end v-if="isAsideDocMenu">
      <layout-content-aside-card
        class="sideMenu"
        v-if="menuTree.length"
        ref="sideMenu"
      >
        <template #title>
          <i class="i-material-symbols:menu-rounded"></i>
          <span>目录</span>
        </template>
        <template #body>
          <layout-content-doc-menu-tree :menuData="menuTree">
          </layout-content-doc-menu-tree>
        </template>
      </layout-content-aside-card>
    </template>
    <!-- 内容区 -->
    <template #content-start>
      <teleport to="body" v-if="article">
        <context-menu>
          <div class="doc-pages-header">
            <div class="container">
              <div class="title cur-text">{{ article?.title }}</div>
              <div class="author cur-text">作者--{{ article?.author }}</div>
              <div class="desc">
                <div class="item">
                  <div class="item-data">
                    <span class="label cur-text">
                      <i class="i-oui:token-date"></i>
                      发表于
                    </span>
                    <span class="content cur-text">{{
                      moment(article?.createdAt)
                    }}</span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mingcute:refresh-3-line"></i>更新于</span
                    >
                    <span class="content cur-text">{{
                      moment(article?.updatedAt)
                    }}</span>
                  </div>
                </div>

                <div class="item">
                  <div class="item-data">
                    <span class="label cur-text">
                      <i class="i-tabler:clover-filled"></i>
                    </span>
                    <span class="content cur-text doc-header-link cur-pointer">
                      <router-link
                        :to="`/user/categories?author=${article.author}&category=${article.category}`"
                        >{{ article?.category }}</router-link
                      >
                    </span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mynaui:label-solid"></i
                    ></span>
                    <span class="content">
                      <template
                        v-for="(item, index) in article?.tags"
                        :key="item"
                      >
                        <span class="doc-header-link cur-pointer">
                          <router-link
                            :to="`/user/tags?author=${article.author}&tags=${item}`"
                            >{{ item }}</router-link
                          >
                        </span>
                        <span
                          class="tags-doc"
                          v-if="index !== article?.tags.length - 1"
                          >·</span
                        >
                      </template>
                    </span>
                  </div>
                </div>
                <div class="item">
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-oui:token-date"></i>字数总计:</span
                    >
                    <span class="content cur-text">{{
                      numberTransform(article?.length)
                    }}</span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mingcute:refresh-3-line"></i>阅读时长:</span
                    >
                    <span class="content cur-text">1分钟</span>
                  </div>
                  <span class="item-hr">|</span>
                  <div class="item-data">
                    <span class="label cur-text"
                      ><i class="i-mingcute:refresh-3-line"></i>浏览量:</span
                    >
                    <span class="content cur-text">{{
                      numberTransform(23208)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="header-animate">
              <animations-waves
                oneColor="var(--doc-header-waves-color-1)"
                twoColor="var(--doc-header-waves-color-2)"
                threeColor="var(--doc-header-waves-color-3)"
                class="cursor-[var(--cursor-default)]"
              ></animations-waves>
            </div>
          </div>
        </context-menu>
      </teleport>
      <!-- 卡片 -->
      <div class="doc-content">
        <my-card>
          <template #body>
            <div id="vditor-preview" ref="docPreview" class="cur-text"></div>
          </template>
        </my-card>
      </div>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="Document">
// 引入 api
import { getOneArticle } from "@/api/article"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import type { TocNode } from "./types"
// 引入 moment
import moment from "@/utils/moment"
// 引入 Vditor
import Vditor from "vditor"
import "vditor/dist/index.css"
// 引入 自定义工具 大数字转中文
import numberTransform from "@/utils/numberTransform"
// 引入 仓库
import { useSettingStore } from "@/store/setting"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 交叉传感器
import { observer } from "@/utils/observer"
// 提取数据
const {
  isDark,
  docMenuIsFixedLazy,
  docMenuIsFixed,
  asideCounts,
  isAsideDocMenu,
} = storeToRefs(useSettingStore())

// 存储文章
const article = ref<GetOneArticle["data"]>()
// 根据路由判断
const route = useRoute()

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

// 存储目录树
const menuTree = ref<TocNode[]>([])

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

  headings.forEach((heading) => {
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
}
const docPreview = ref()
const preview = () => {
  if (article?.value?.content) {
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
    })
  }
}

const sideMenu = ref()
// 挂载
const enterScrollListener = () => {
  if (!isAsideDocMenu.value) return
  // 要等 组件渲染完毕后 在执行
  // 因为异步 setinterval 需要先把元素 获取到
  initElements(() => {
    // 使用交叉传感器
    if (docMenuIsFixedLazy.value) {
      if (penultimate)
        observer(
          penultimate,
          () => {
            sibEnter = false
            removeStickyClasses()
          },
          () => {
            sibLeave = false
            if (!sibEnter && !sibLeave) {
              if (toggle) {
                // 重置
                sibEnter = true
                sibLeave = true
                // 固定
                toggleMenuPosition()
              }
            }
          }
        )
      return
    }
    // 不使用交叉传感器 使用滚动监听
    window.addEventListener("scroll", enterScrollListenerCb)
  })
}
// 卸载
const unEnterScrollListener = () => {
  // 移除类名
  removeStickyClasses()
  // 初始化存储的值
  enterFlag = true
  leaveFlag = true
  menuWrap = null
  penultimate = null
  // 没有交叉传感器
  !docMenuIsFixedLazy.value &&
    window.removeEventListener("scroll", enterScrollListenerCb)
}
// 重载
const reloadEnterScrollListener = () => {
  // 重载
  unEnterScrollListener()
  enterScrollListener()
}
// 初始化需要的数据
let enterFlag = true
let leaveFlag = true
let menuWrap: HTMLDivElement | null = null
let penultimate: HTMLDivElement | null = null
// 交叉传感器 需要用到的
let sibEnter = true
let sibLeave = true
/* 
  进入时 取消固定
  进入离开 时 固定
*/
let toggle = true
// 初始化元素
const initElements = (fn: Function) => {
  if (!menuWrap) {
    menuWrap = document.querySelector(".sideMenu") as HTMLDivElement
  }
  if (!penultimate) {
    let now = Date.now()
    // 组件没有挂载完 重新获取 500ms 一次
    const timer = setInterval(() => {
      const container = document.querySelector(".content-aside")
      penultimate = container?.children[
        container?.children.length - 2
      ] as HTMLDivElement | null
      const cur = (Date.now() - now) / 1000
      if (cur > 5) {
        ElMessage.error("菜单组件固定失败，不能获取到对应的信息~")
        clearInterval(timer)
      }
      console.log(container?.children.length, asideCounts.value)
      if (container?.children.length === asideCounts.value) {
        fn && fn()
        clearInterval(timer)
      }
    }, 500)
  }
}
// 没有交叉传感器 更新菜单位置
const updateMenuPosition = () => {
  if (!menuWrap || !penultimate) return

  const rect = penultimate.getBoundingClientRect()
  const bottom = rect.bottom

  // 进入视口
  if (bottom <= 0 && enterFlag) {
    enterFlag = false
    leaveFlag = true
    toggleMenuPosition()
  }
  // 离开视口
  else if (bottom > 0 && leaveFlag) {
    enterFlag = true
    leaveFlag = false
    removeStickyClasses()
  }
}
// 添加类名
const toggleMenuPosition = () => {
  if (!menuWrap) return
  if (menuWrap.offsetLeft < 100) {
    // 菜单栏在左侧
    menuWrap.classList.add("aside-menu-sticky-left")
    menuWrap.classList.remove("aside-menu-sticky-right")
  } else {
    // 菜单栏在右侧
    menuWrap.classList.add("aside-menu-sticky-right")
    menuWrap.classList.remove("aside-menu-sticky-left")
  }
}
// 移除类名
const removeStickyClasses = () => {
  if (menuWrap) {
    menuWrap.classList.remove("aside-menu-sticky-right")
    menuWrap.classList.remove("aside-menu-sticky-left")
  }
}

// 没有交叉传感器 目录进入视口时监听 滚动事件 回调
let enterScrollListenerCb = () => {
  if (!isAsideDocMenu.value) return
  updateMenuPosition()
}

// 监听菜单组件是否挂载
watch(
  () => sideMenu.value?.$el,
  (newV) => {
    if (newV && docMenuIsFixed.value) {
      enterScrollListener()
    } else if (docMenuIsFixed.value) unEnterScrollListener()
  }
)

// 判断是否固定
watch(
  () => docMenuIsFixed.value,
  (newV) => {
    if (!newV && isAsideDocMenu.value) unEnterScrollListener()
    else if (isAsideDocMenu.value) enterScrollListener()
  }
)

// 监听 是否还存在 不存在 肯定不用固定
watch(
  () => isAsideDocMenu.value,
  (newV) => {
    if (!newV) {
      docMenuIsFixed.value = false
    }
  }
)

// 订阅 暗夜切换 事件
mitt.on("isDark", preview)
// 订阅 布局切换 事件
mitt.on("contentIsReverse", reloadEnterScrollListener)
mitt.on("isAside:true", reloadEnterScrollListener)

// 初始化
onBeforeMount(async () => {
  // 获取文章
  const articles = await getOneArticle(route.params.id as string)
  article.value = articles
  // 渲染 文章
  preview()
})
</script>

<style scoped lang="scss">
// 引入 函数
@use "sass:map";

$pages-m-t: -30vh;
$header-t: 150px;
$desc-gap: 10px;
$hr-m-hor: 10px;
$author-m: 10px 0;
$icon-m-r: 2px;
$header-h: 18.75rem;
$header-container-h: 12.5rem;
$preview-pd: 50px;
$doc-primary-color: var(--doc-content-color);
$color: $doc-primary-color;
$preview-h1-border-l: 10px solid $color;
$preview-h1-border-b: 2px solid $color;
$preview-h2-p-l: 10px;
$preview-calouts-pd: 10px;
$preview-callouts-title-gap: 8px;
@include content-aside-title(var(--aside-title-icon-bg));
// 文档 内容 区域
.doc-content {
  // 设置 卡片 阴影
  .myCard {
    @include setCardShadow;
  }
  // markdown 预览
  ::v-deep(#vditor-preview) {
    padding: $preview-pd;
    color: $doc-primary-color;
    overflow: hidden;
    h1 {
      border-bottom: 0 !important;
      text-align: center;
      position: relative;
      // 分割线
      &:after {
        position: absolute;
        content: "";
        display: block;
        width: 10rem;
        height: 10rem;
        background-repeat: no-repeat;
        background-size: 13rem;
        background-position: center 0;
        left: -14px;
        right: 0;
        top: -80%;
        pointer-events: none;
        margin: auto;
        background-color: currentColor;
        -webkit-mask-image: var(--doc-h1-underline-img);
        mask-image: var(--doc-h1-underline-img);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        @include media(md) {
          top: -50%;
        }
      }
    }

    h2 {
      border-left: $preview-h1-border-l;
      border-bottom: $preview-h1-border-b;
      padding-left: $preview-h2-p-l;
    }

    // #region h2-h6 编号
    $dot: var(--doc-menu-seg);
    $endDot: var(--doc-menu-seg-end);
    counter-reset: level-2; /* 重置三级编号计数器 */
    /* 二级编号 */
    h2 {
      counter-reset: level-3; /* 重置三级编号计数器 */
      counter-increment: level-2; /* 增加二级编号计数器 */
      &::before {
        content: counter(level-2) $endDot; /* 显示二级编号 */
      }
    }
    /* 三级编号 */
    h3 {
      counter-reset: level-4; /* 重置四级编号计数器 */
      counter-increment: level-3; /* 增加三级编号计数器 */
      &::before {
        content: counter(level-2) $dot counter(level-3) $endDot; /* 显示三级编号 */
      }
    }
    /* 四级编号 */
    h4 {
      counter-reset: level-5; /* 重置五级编号计数器 */
      counter-increment: level-4; /* 增加四级编号计数器 */
      &::before {
        content: counter(level-2) $dot counter(level-3) $dot counter(level-4)
          $endDot; /* 显示四级编号 */
      }
    }
    /* 五级编号 */
    h5 {
      counter-reset: level-6; /* 重置六级编号计数器 */
      counter-increment: level-5; /* 增加五级编号计数器 */
      &::before {
        content: counter(level-2) $dot counter(level-3) $dot counter(level-4)
          $dot counter(level-5) $endDot; /* 显示五级编号 */
      }
    }
    /* 六级编号 */
    h6 {
      counter-increment: level-6; /* 增加六级编号计数器 */
      &::before {
        content: counter(level-2) $dot counter(level-3) $dot counter(level-4)
          $dot counter(level-5) $dot counter(level-6) $endDot; /* 显示六级编号 */
      }
    }
    // #endregion h2-h6 编号

    // #region callouts 样式
    // 遍历颜色映射表生成样式
    @each $types, $icon in $callouts-icons {
      blockquote[type="#{$types}"] {
        padding: $preview-calouts-pd;
        // 左侧的边
        border-left-color: var(--doc-callouts-#{$types}-border-l-color);
        // 渐变背景
        background-image: linear-gradient(
          to right,
          var(--doc-callouts-#{$types}-bg-l),
          var(--doc-callouts-#{$types}-bg-r)
        );
        // 颜色
        color: var(#{--doc-callouts-#{$types}-color});
        // 阴影
        filter: drop-shadow(var(--doc-callouts-#{$types}-shadow));
        // 圆角
        border-radius: 0 var(--doc-border-radius) var(--doc-border-radius) 0;
        overflow: hidden;
        // 图标提示信息
        .callouts {
          display: inline-flex;
          align-items: center;
          margin-right: $preview-callouts-title-gap;
          // 图标
          &::before {
            width: 15px;
            height: 15px;
            padding-right: $preview-callouts-title-gap;
            display: inline-block;
            content: "";
            background-color: currentColor;
            -webkit-mask-image: var(#{--doc-callouts-#{$types}-icon-url});
            mask-image: var(#{--doc-callouts-#{$types}-icon-url});
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
          }
          // 相邻的p
          + p:nth-of-type(1) {
            display: inline;
            // 距离下个元素的距离
            + * {
              margin-top: var(--doc-callouts-title-m-b);
            }
          }
        }
      }
    }
    // #endregion callouts 样式
    // 超链接
    a {
      @include pages-links-hover;
      color: var(--doc-link-color);
    }

    // 代码`code`
    p code {
      background-color: var(--doc-code-bg);
      color: var(--doc-code-color);
      font-size: 15px;
      border-radius: var(--doc-code-radius);
    }

    // 多选框
    .vditor-task {
      // 垂直居中
      display: flex;
      align-items: center;
      // 多选框
      input[type="checkbox"] {
        all: unset;
        width: var(--doc-checkbox-size);
        height: var(--doc-checkbox-size);
        display: inline-block;
        position: relative;
        margin-right: var(--doc-checkbox-m-r);
        border: var(--doc-checkbox-border);
        border-radius: var(--doc-checkbox-radius);
        overflow: hidden;
        cursor: var(--cursor-default);
      }
      input[type="checkbox"]::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background-color: var(--doc-checkbox-bg);
      }
      input[type="checkbox"]:checked {
        &::before {
          display: block;
          content: "";
          position: absolute;
          z-index: 2;
          inset: 0;
          color: var(--doc-checkbox-border-color);
          background-color: currentColor;
          -webkit-mask-image: var(--doc-checkbox-tick-url);
          mask-image: var(--doc-checkbox-tick-url);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }
      }
    }

    // 分割线
    hr {
      $scissors-size: 30px;
      display: block;
      height: $scissors-size;
      background-color: unset;
      cursor: var(--cursor-default);
      position: relative;
      overflow: visible;
      // 普通分割线
      &::before {
        color: var(--doc-hr-color);
        display: block;
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -$preview-pd;
        z-index: 1;
        width: calc(100% + #{$preview-pd * 2});
        height: 100%;
        // 普通分割线
        background-color: currentColor;
        -webkit-mask-image: var(--doc-hr-url);
        mask-image: var(--doc-hr-url);
        -webkit-mask-repeat: repeat-x;
        mask-repeat: repeat-x;
        $size: var(--doc-hr-size);
        -webkit-mask-size: $size;
        mask-size: $size;
      }
      &:hover {
        &::after {
          left: calc(100% + $scissors-size / 2);
        }
      }
      // scissors
      &::after {
        color: var(--doc-hr-color);
        display: block;
        content: "";
        position: absolute;
        z-index: 2;
        top: 50%;
        transform: translateY(-50%);
        transition: left var(--doc-scissors-dur);
        left: -$preview-pd;
        width: calc(100% + #{$preview-pd * 2});
        height: $scissors-size;
        // 普通分割线
        background-color: currentColor;
        -webkit-mask-image: var(--doc-scissors-url);
        mask-image: var(--doc-scissors-url);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: $scissors-size;
        mask-size: $scissors-size;
      }
      // 脚注分割线
      &.footnotes-defs-hr {
        &::before {
          color: var(--doc-footnotes-hr-color);
        }
      }
    }

    // 高亮
    .doc-highlight {
      background-color: var(--doc-highlight-bg);
      color: var(--doc-highlight-color);
      padding: var(--doc-highlight-pd);
      border-radius: var(--doc-highlight-radius);
    }

    // 表格
    table {
      // 设置 表格单元的 样式
      tr {
        border: none;
        $radius: 10px;
        $header-border: var(--doc-table-header-border);
        $header-bottom-border: var(--doc-table-header-bottom-border);
        $body-border: var(--doc-table-body-border);
        $body-bottom-border: var(--doc-table-body-bottom-border);
        // 表头
        > th {
          background-color: var(--doc-table-th-bg);
          border: none;
          color: var(--doc-table-th-color);
          &:first-child {
            border-top-left-radius: $radius;
          }
          &:last-child {
            border-top-right-radius: $radius;
          }
          // 设置 边框
          border-bottom: $header-bottom-border;
          &:not(:last-child) {
            border-right: $header-border;
          }
        }
        // 表体
        > td {
          background-color: var(--doc-table-td-bg);
          border: none;
          color: var(--doc-table-td-color);
          // 设置 边框
          &:not(:last-child) {
            border-right: $body-border;
          }
        }
        &:not(:last-child) {
          border-bottom: $body-bottom-border;
        }
        &:last-child {
          > td {
            &:first-child {
              border-bottom-left-radius: $radius;
            }
            &:last-child {
              border-bottom-right-radius: $radius;
            }
          }
        }
      }
    }
  }
}
// 页面区域
::v-deep(.pages) {
  margin-top: $pages-m-t;
  z-index: 10;
}
// 侧边栏吸附效果
::v-deep(.aside-menu-sticky-right) {
  position: fixed !important;
  top: calc(var(--header-height) + var(--content-gap));
  z-index: 4;
  right: var(--content-gap);
  width: calc(var(--aside-width) - 0.1875rem);
}
// 侧边栏吸附效果 左侧
::v-deep(.aside-menu-sticky-left) {
  position: fixed !important;
  top: calc(var(--header-height) + var(--content-gap));
  z-index: 4;
  left: var(--content-gap);
  width: calc(var(--aside-width) - 0.1875rem);
}
// 头部
.doc-pages-header {
  position: absolute;
  width: 100%;
  height: $header-h;
  top: $header-t;
  z-index: 2;
  // 文本容器
  > .container {
    color: var(--doc-header-color);
    height: $header-container-h;
    display: flex;
    flex-direction: column;
    align-items: center;
    > .title {
      font-size: 40px;
    }
    > .author {
      font-size: 20px;
      margin: $author-m;
    }
    > .desc {
      display: flex;
      flex-direction: column;
      gap: $desc-gap;
      .item {
        display: flex;
        justify-content: center;
        .item-data {
          display: flex;
          align-items: center;
          .label {
            display: flex;
            align-items: center;
          }
          // 跳转链接
          .doc-header-link {
            transition: color var(--primary-during);
            &:hover {
              color: var(--doc-header-link);
            }
          }
          // 图标
          i {
            margin-right: $icon-m-r;
          }
        }
        // 分割线
        .item-hr {
          margin: 0 $hr-m-hor;
        }
      }
    }
  }
  // 动画
  > .header-animate {
    height: $header-h - $header-container-h;
  }
}
</style>
