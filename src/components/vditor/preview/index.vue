<template>
  <div class="my-vditor-container">
    <div
      id="vditor-preview"
      ref="docPreview"
      class="cur-text vditor-style"
    ></div>
  </div>
</template>

<script setup lang="ts" name="VditorPreview">
// 引入 文章渲染函数
import { useVditorPreview } from "@/hooks/Doc/vditorPreview"
// 引入 文章侧边目录高亮显示
import { useSideMenuHighlight } from "@/hooks/Doc/sideMenuHighlight"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import { TocNode } from "@/hooks/Doc/vditorPreview/types"
// markdown 渲染的容器
const docPreview = ref<HTMLDivElement | undefined>()
const article = defineModel<GetOneArticle["data"]>("article")
const menuTree = defineModel<Ref<TocNode[]>>("menuTree")
// 调用 渲染文章
// @ts-ignore
useVditorPreview(article, menuTree, docPreview, useSideMenuHighlight)
</script>

<style scoped lang="scss">
.my-vditor-container {
  // markdown 预览
  ::v-deep(#vditor-preview) {
    $preview-pd: 50px;
    $doc-primary-color: var(--doc-content-color);
    $color: #{$doc-primary-color};
    // 书写区域
    $preview-h1-border-l: 10px solid #{$color};
    $preview-h1-border-b: 2px solid #{$color};
    $preview-h2-p-l: 10px;
    // callouts
    $preview-calouts-pd: 10px;
    $preview-callouts-title-gap: 8px;
    color: $doc-primary-color;
    padding: $preview-pd;
    overflow: hidden;
    border: unset;

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
    $dot: var(--doc-content-seg);
    $endDot: var(--doc-content-seg-end);
    & {
      counter-reset: level-2; /* 重置三级编号计数器 */
    }
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
    @mixin callouts-gen($types: "default") {
      & {
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

    @mixin callouts($types: "default") {
      @if $types == "default" {
        blockquote {
          @include callouts-gen($types);
        }
      } @else {
        blockquote[type="#{$types}"] {
          @include callouts-gen($types);
        }
      }
    }

    // 遍历颜色映射表生成样式
    @each $types, $icon in $callouts-icons {
      @include callouts($types);
    }

    // #endregion callouts 样式

    // 超链接
    a {
      @include pages-links-hover;
      color: var(--doc-link-color);
    }

    // 代码`code`
    code {
      background-color: var(--doc-code-bg);
      color: var(--doc-code-color);
      font-size: 15px;
      border-radius: var(--doc-code-radius);
    }
    pre > code.hljs {
      box-shadow: var(--doc-pre-code-shadow);
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
      $radius: 10px;
      width: fit-content;
      border-radius: $radius;
      overflow: hidden;
      box-shadow: var(--doc-table-td-shadow);
      // 设置 表格单元的 样式
      tr {
        border: none;
        $header-border: var(--doc-table-header-border);
        $header-bottom-border: var(--doc-table-header-bottom-border);
        $body-border: var(--doc-table-body-border);
        $body-bottom-border: var(--doc-table-body-bottom-border);
        // 表头
        > th {
          background-color: var(--doc-table-th-bg);
          border: none;
          color: var(--doc-table-th-color);
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
      }
    }

    // 有序列表
    ol {
      // 定义符号变量
      $ol-seg: var(--preview-ol-seg);
      counter-reset: list;
      list-style: none; // 移除默认的列表样式
      padding: 0;
      margin: 0;
      li {
        counter-increment: list;
        list-style: none;
        position: relative;
        padding-left: 1.25rem;

        &::before {
          content: counter(list) $ol-seg;
          position: absolute;
          left: 0;
          color: $doc-primary-color;
        }
      }
    }

    // 无序列表
    ul {
      // 定义符号变量
      $ul-symbol-1: var(--preview-ul-symbol-1); // 一级列表标记
      $ul-symbol-2: var(--preview-ul-symbol-2); // 二级列表标记
      $ul-symbol-3: var(--preview-ul-symbol-3); // 三级列表标记
      list-style: none; // 移除默认的列表样式
      padding: 0;
      margin: 0;

      li:not(.vditor-task) {
        position: relative;
        padding-left: 1rem;

        &::before {
          content: $ul-symbol-1; // 默认使用实心点
          position: absolute;
          left: 3px;
          font-weight: bold;
          color: $doc-primary-color;
        }
      }

      ul li:not(.vditor-task) {
        &::before {
          content: $ul-symbol-2; // 二级列表使用空心点作为标记
        }

        ul li:not(.vditor-task) {
          &::before {
            content: $ul-symbol-3; // 三级列表使用方块作为标记
          }
        }
      }
    }
  }
}
</style>
