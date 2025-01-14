```vue
<template>
  <layout-header />
  <layout-banner :context="false"></layout-banner>
  <layout-content :isAllAside="false">
    <!-- 侧边栏 -->
    <template #aside-start v-if="article">
      <layout-content-aside-card ref="sideMenu" class="sideMenu">
        <template #title>
          <i class="i-material-symbols:menu-rounded"></i>
          <span>目录</span>
        </template>
        <template #body>fds </template>
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
            <div id="vditor-preview" class="cur-text"></div>
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
// 引入 moment
import moment from "@/utils/moment"
// 引入 Vditor
import Vditor from "vditor"
import "vditor/dist/index.css"
// 引入 自定义工具 大数字转中文
import numberTransform from "@/utils/numberTransform"
// 引入 仓库
import { useSettingStore } from "@/store/setting"

// 提取数据
const { isDark } = storeToRefs(useSettingStore())

// 存储文章
const article = ref<GetOneArticle["data"]>()
// 根据路由判断
const route = useRoute()
// 获取侧边栏
const sideMenu = ref()

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
// 初始化
onMounted(async () => {
  // 获取文章
  const articles = await getOneArticle(route.params.id as string)
  article.value = articles
  // 监听 isDark 改变 主题样式
  watch(
    () => isDark.value,
    async () => {
      // Vditor 渲染markdown
      const container = document.querySelector(
        "#vditor-preview"
      ) as HTMLDivElement
      if (container && article?.value?.content) {
        await Vditor.preview(container, article.value.content, {
          theme: { current: "light" },
          //代码块
          hljs: {
            enable: true, // 启用代码高亮
            style: isDark.value ? "github-dark" : "github", //主题
            lineNumber: true, //行号
          },
          mode: "light", //模式
          anchor: 2, //标题的链接锚点
          // 转换之前 处理
          transform: (html: string) => {
            // 初始化 锚点
            // 用于 设置 颜色
            let result = addFillToSVG(html)
            // 给 blockquote 添加 type 以实现 callouts
            result = addTypeToBlockquote(result)
            // 给 markdown 添加 高亮显示 ==高亮文本==
            result = addHighlight(result)
            return result
          },
        })
        // 设置 数字序号
      }
    },
    {
      immediate: true,
    }
  )
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
$header-h: 300px;
$header-container-h: 200px;
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
    & {
      counter-reset: h2 h3 h4 h5 h6; /* 初始化计数器 */
    }

    h2 {
      & {
        counter-reset: h3; /* h2 级别重置 h3 计数器 */
      }
      &::before {
        counter-increment: h2; /* h2 计数器递增 */
        content: counter(h2) ". "; /* 显示 h2 编号 */
      }
    }

    h3 {
      & {
        counter-reset: h4; /* h3 级别重置 h4 计数器 */
      }
      &::before {
        counter-increment: h3; /* h3 计数器递增 */
        content: counter(h2) "." counter(h3) ". "; /* 显示 h3 编号 */
      }
    }

    h4 {
      & {
        counter-reset: h5; /* h4 级别重置 h5 计数器 */
      }
      &::before {
        counter-increment: h4; /* h4 计数器递增 */
        content: counter(h2) "." counter(h3) "." counter(h4) ". "; /* 显示 h4 编号 */
      }
    }

    h5 {
      & {
        counter-reset: h6; /* h5 级别重置 h6 计数器 */
      }
      &::before {
        counter-increment: h5; /* h5 计数器递增 */
        content: counter(h2) "." counter(h3) "." counter(h4) "." counter(h5)
          ". "; /* 显示 h5 编号 */
      }
    }

    h6 {
      &::before {
        counter-increment: h6; /* h6 计数器递增 */
        content: counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) "."
          counter(h6) ". "; /* 显示 h6 编号 */
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
  }
}
// 页面区域
::v-deep(.pages) {
  margin-top: $pages-m-t;
  z-index: 10;
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
```
