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
// 引入 测试数据
import test from "./test/test.md?raw"

// 存储文章
const article = ref<GetOneArticle["data"]>()
// 根据路由判断
const route = useRoute()
// 获取侧边栏
const sideMenu = ref()

// 提取数据
const { isDark } = storeToRefs(useSettingStore())
watch(
  () => isDark.value,
  () => {
    nextTick(() => {
      // Vditor 渲染markdown
      const container = document.querySelector(
        "#vditor-preview"
      ) as HTMLDivElement
      if (container) {
        Vditor.preview(container, test, {
          theme: { current: "light" },
          //代码块
          hljs: {
            enable: true, // 启用代码高亮
            style: isDark.value ? "github-dark" : "github", //主题
            lineNumber: true, //行号
          },
          mode: "light", //模式
          anchor: 2, //标题的链接锚点
        })
      }
    })
  },
  {
    immediate: true,
  }
)
// 初始化
onMounted(async () => {
  // 获取文章
  const articles = await getOneArticle(route.params.id as string)
  article.value = articles
})
</script>

<style scoped lang="scss">
$pages-m-t: -30vh;
$header-t: 150px;
$desc-gap: 10px;
$hr-m-hor: 10px;
$author-m: 10px 0;
$icon-m-r: 2px;
$header-h: 300px;
$header-container-h: 200px;
@include content-aside-title(var(--aside-title-icon-bg));
.doc-content {
  // 设置 卡片 阴影
  @include setCardShadow;
  #vditor-preview {
    padding: 50px;
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
