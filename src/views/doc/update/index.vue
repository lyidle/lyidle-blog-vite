<template>
  <layout-content>
    <template #content-start>
      <my-card class="doc-publish-content relative card_style">
        <el-form :rules="rules" :model="docsFormData" ref="docsForm">
          <el-form-item class="!mb-0">
            <div class="flex justify-end w-100%">
              <my-button
                size="small"
                type="warning"
                @click="$router.replace(`/user/docs/${docAuthor}`)"
                class="w-70px"
                >取消修改</my-button
              >
              <my-button
                size="small"
                class="w-70px"
                v-throttle="{ fn: handerUpload }"
                >更新文章
              </my-button>
            </div>
          </el-form-item>
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的标题"
            prop="title"
          >
            <my-input v-model="docsFormData.title" placeholder="文章的标题">
            </my-input>
          </el-form-item>
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的分类"
            prop="category"
          >
            <my-input v-model="docsFormData.category" placeholder="文章的分类">
            </my-input>
          </el-form-item>
          <el-form-item
            class="!mb-0 is-required doc-publish-item"
            label="文章的标签"
          >
            <my-tags
              v-model="docsFormData.tags"
              ref="tagsInstance"
              repeatError="标签不能重复"
              :error="tagsReg.msg"
              class="ml-0.625rem"
            ></my-tags>
          </el-form-item>
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的描述"
            prop="desc"
          >
            <my-input v-model="docsFormData.desc" placeholder="文章的描述">
            </my-input>
          </el-form-item>

          <!-- poster -->
          <el-form-item
            class="!mb-0 doc-publish-item ml-11px"
            label="文章的海报"
          >
            <my-upload
              v-model="poster"
              :auto-remove="false"
              class="ml-10px"
            ></my-upload>
          </el-form-item>
        </el-form>
        <h3 class="font-normal m-20px text-center font-size-1.625rem">
          文章的内容
        </h3>
        <div id="vditor-update" class="vditor-style" ref="vditorEditor"></div>
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="DocumentUpdate">
// 引入 编辑器的 hooks
import { useVditorUpdate, vditorType } from "@/hooks/Doc/vditorEditor/update"
// 引入 编辑器 全屏事件的 处理 hooks
import { useIsFullscreen } from "@/hooks/Doc/vditorEditor/isFullScreen"
import { uploadFiles } from "@/components/my/upload/index.vue"
// 压缩 与 解压
import { decompressString } from "@/utils/compression"
// 引入 api
import { getArticleByAuthorAndId, updateArticle } from "@/api/article"
// 引入 类型
import { UpdateArticleBody } from "@/api/article/types/updateArticleBody"
// 引入 正则
import {
  titleReg,
  categoryReg,
  tagsReg,
  descReg,
  contentReg,
} from "@/RegExp/Docs"
// 引入 hooks
import { useMdReplaceImg } from "@/hooks/Doc/vditorEditor/mdImgToLinkPermanent"
import { mitt } from "@/utils/emitter"
import { postImgPermanent, removeFileStatic } from "@/api/img"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
const route = useRoute()
const router = useRouter()
// 上传的 poster图
const poster = ref<uploadFiles>([])
// 初始的 poster图
let originPoster: string | null = null
// 得到 作者和id
const docAuthor = route.query.author as string
const docId = route.query.id as string
// 获取文章数据
const reqArticle = async () => {
  try {
    const Article = await getArticleByAuthorAndId({
      author: docAuthor,
      id: docId,
    })
    if (!Article?.content) {
      ElMessage.error("没有找到文章信息~")
      return
    }
    docsFormData.title = Article?.title || ""
    docsFormData.category = Article?.category || ""
    docsFormData.tags = Article?.tags || []
    docsFormData.desc = Article?.desc || ""
    if (Article.poster) {
      // 展示poster
      poster.value = [{ name: "", url: Article.poster }]
      // 保存原有的图片
      originPoster = Article.poster
    }

    // 内容尝试解压 失败就展示原内容
    try {
      context.value = decompressString(Article?.content || "") as string
    } catch (error) {
      context.value = Article?.content || ""
    }
    // 挂载 vditor
    vditorHookReturn.Mounted()
  } catch (error) {
    // 触发路由守卫 账户不一致事件
    const err = handlerReqErr(error, (err) => {
      if (err?.includes("没有查找到文章")) {
        mitt.emit("account inconsistent", "无权限更新当前文章~")
      }
    })
    if (!err) mitt.emit("account inconsistent", "获取文章失败~")
  }
}

// 文章相关信息
const docHeight = ref("85vh")
const length = ref()
const context = ref<string>("")

// #region 表单 验证
const docsFormData = reactive<{
  title: string
  category: string
  desc: string
  tags: string[]
}>({
  title: "",
  category: "",
  desc: "",
  tags: [],
})

// 表单组件实例
const docsForm = ref()
// tags的组件实例
const tagsInstance = ref()
// 表单规则
const rules = reactive({
  title: [
    {
      required: true,
      message: "标题不能为空",
      trigger: "change",
    },
    {
      pattern: titleReg.reg,
      message: titleReg.msg,
      trigger: "change",
    },
  ],
  category: [
    {
      required: true,
      message: "文章分类不能为空",
      trigger: "change",
    },
    {
      pattern: categoryReg.reg,
      message: categoryReg.msg,
      trigger: "change",
    },
  ],
  desc: [
    {
      required: true,
      message: "文章描述不能为空",
      trigger: "change",
    },
    {
      pattern: descReg.reg,
      message: descReg.msg,
      trigger: "change",
    },
  ],
})
// #endregion 表单 验证

// vditor 容器
const vditorEditor = ref()

// 使用 hook
let vditorHookReturn = useVditorUpdate("vditor-update", vditorEditor, {
  docHeight,
  context,
  length,
})

// vditor实列
let vditor: vditorType = vditorHookReturn.vditor

// 提交的数据整理
const handerUpload = async () => {
  try {
    // 验证 数据
    await docsForm.value.validate()
    // 验证tags
    tagsInstance.value.validate?.()
    // 验证 内容
    if (+(length.value || 0) < contentReg.min) {
      ElMessage.error(contentReg.msg)
      return
    }
    const content = vditor.value?.getValue() || ""
    // 整理 数据
    const data: UpdateArticleBody = {
      title: docsFormData.title as string,
      category: docsFormData.category as string,
      tags: docsFormData.tags,
      desc: docsFormData.desc || "",
      content: "",
      length: length.value as string,
      id: +docId,
    }

    // 处理 临时链接转换
    await useMdReplaceImg(content, data)

    // 判断是否有更新的上传海报
    const newPoster = poster.value?.[0]?.url
    let isUpdatePoster = false
    // 更新了 poster 则修改
    if (newPoster && newPoster !== originPoster) {
      const tempImg = [newPoster]
      const result = await postImgPermanent({
        tempImg,
        account: docAuthor,
        path: "/md/poster",
      })
      if (result) {
        const { successImg, tempImgNull } = result
        // 临时图片失效的
        if (tempImgNull.length) {
          tempImgNull.forEach((item) => {
            ElMessage.warning({
              message: `文章的海报临时图片:${item}不存在~`,
              customClass: "selectMessage",
            })
          })
        }
        // 得到 成功的poster
        const _poster = successImg?.[0]?.url
        // 修改 poster
        if (_poster) {
          data.poster = _poster
          isUpdatePoster = true
        }
      }
    }

    // 更新
    await updateArticle(data)

    // 更新了 原图 且原图存在 则删除
    if (isUpdatePoster && originPoster) {
      try {
        await removeFileStatic([originPoster])
      } catch (error) {}
    }

    ElMessage.success("更新文章成功~")

    router.replace(`/doc/${docId}`)
  } catch (error) {
    // 触发路由守卫 账户不一致事件
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("更新文章失败~")
  }
}

// 使用 编辑器是否全屏的hook
useIsFullscreen(vditorEditor)

// 挂载
onMounted(async () => {
  await reqArticle()
})

// 卸载
onBeforeUnmount(() => {
  vditorHookReturn.UnMounted()
})
</script>
<style scoped lang="scss">
@use "sass:map";
$content-pd: 0.9375rem 2.5rem;
$toolbar-pl: 5rem;
$item-gap-v: 0.8125rem;
// 设置 卡片 样式
@include setCardStyle;

.doc-publish-content {
  @include set-el-label(var(--primary-color));
  padding: $content-pd;
  // markdown 预览
  ::v-deep(.vditor-style) {
    $preview-pd: 0;
    $doc-primary-color: var(--doc-content-color);
    $color: #{$doc-primary-color};
    // 书写区域
    $preview-bg: var(--editor-bg);
    $preview-h1-border-l: var(--editor-h1-border-l);
    $preview-h1-border-b: var(--editor-h1-border-b);
    $preview-h2-p-l: var(--editor-h2-p-l);
    // callouts
    $preview-calouts-pd: var(--editor-calouts-pd);
    $preview-callouts-title-gap: var(--editor-callouts-title-gap);
    // 提示信息
    $preview-h1-h6-tip-color: var(--editor-h1-h6-tip-color);
    $preview-h1-h6-tip-size: var(--editor-h1-h6-tip-size);
    $preview-shadow: var(--editor-shadow);
    $preview-radius: var(--editor-radius);
    // 工具栏
    $toolbar-bg: var(--editor-toolbar-bg);
    $toolbar-icon-color: var(--editor-toolbar-icon-color);
    $toolbar-icon-color-hover: var(--editor-toolbar-icon-color-hover);
    $toolbar-icon-color-disabled: var(--editor-toolbar-icon-color-disabled);
    $toolbar-divide-color: var(--editor-toolbar-divide-color);
    // 下拉面板
    $panel-bg: var(--editor-panel-bg);
    $panel-bg-hover: var(--editor-panel-bg-hover);
    $panel-bg-active: var(--editor-panel-bg-active);
    $panel-color: var(--editor-panel-color);
    $panel-color-hover: var(--editor-panel-color-hover);
    $panel-color-active: var(--editor-panel-color-active);

    color: $doc-primary-color;
    padding: $preview-pd;
    border: unset;
    box-shadow: $preview-shadow;
    border-radius: $preview-radius;

    // 书写区域
    .vditor-reset {
      color: inherit;
      background-color: $preview-bg;
      cursor: var(--cursor-text);
      overflow-x: hidden;
    }

    // 工具 栏
    .vditor-toolbar {
      border: unset;
      border-radius: $preview-radius $preview-radius 0 0;
      .vditor-toolbar__item input {
        cursor: var(--cursor-pointer) !important;
      }
      background-color: $toolbar-bg;
      // 图标
      --toolbar-icon-color: #{$toolbar-icon-color};
      // 悬浮 和 激活的样式
      --toolbar-icon-hover-color: #{$toolbar-icon-color-hover};
      // 没有激活的样式
      --second-color: #{$toolbar-icon-color-disabled};

      // 下拉面板的 箭头
      .vditor-panel--arrow:before {
        top: -13px;
      }

      // 下拉面板
      .vditor-hint {
        --panel-background-color: #{$panel-bg};
        box-shadow: unset;
        filter: var(--editor-panel-filter);
        button {
          color: $panel-color;
          &.vditor-menu--current,
          &.vditor-hint--current {
            color: #{$panel-color-active} !important;
            background-color: #{$panel-bg-active} !important;
          }

          &:hover {
            background-color: $panel-bg-hover !important;
            color: $panel-color-hover !important;
          }
        }
      }
      // 分割线
      .vditor-toolbar__divider {
        border-color: $toolbar-divide-color;
      }
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

    $h2-ml: 0.625rem;
    // 恢复 编号的样式
    @for $i from 1 through 6 {
      h#{$i} {
        position: relative;
        &:before {
          cursor: var(--cursor-default);
          @if $i==1 {
            // 去除提示信息
            all: unset;
          }
          font-size: inherit;
          color: inherit;
          @if $i==2 {
            margin-left: $h2-ml;
          } @else {
            @if $i !=1 {
              padding-left: 10px;
            }
          }
        }
      }
    }

    // 提示的信息
    @for $i from 1 through 6 {
      h#{$i} {
        position: relative;
        &::after {
          $left: -4.0938rem;
          position: absolute;
          content: "H#{$i}";
          display: block;
          cursor: var(--cursor-default);
          @if $i == 2 {
            left: $left - $h2-ml;
          } @else {
            left: $left;
          }
          font-size: $preview-h1-h6-tip-size;
          color: $preview-h1-h6-tip-color;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    h1 {
      border-bottom: 0 !important;
      text-align: center;
      position: relative;
      // 分割线
      &::before {
        position: absolute;
        content: "";
        display: block;
        width: 10rem;
        height: 10rem;
        background-repeat: no-repeat;
        background-size: 13rem;
        background-position: center 0;
        left: 0.625rem;
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
    p code {
      background-color: var(--doc-code-bg);
      color: var(--doc-code-color);
      font-size: 15px;
      border-radius: var(--doc-code-radius);
    }
    pre > code.hljs {
      box-shadow: var(--doc-pre-code-shadow);
      cursor: var(--cursor-default);
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
        cursor: var(--cursor-pointer) !important;
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
      position: relative !important;
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
        width: 100%;
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
          left: calc(100% - $scissors-size);
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
        left: 0;
        width: 100%;
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
  .doc-publish-item {
    margin-top: $item-gap-v;
  }
  // tags的input宽度
  ::v-deep(.tags-input) {
    input {
      width: 5rem;
    }
  }
}
</style>
