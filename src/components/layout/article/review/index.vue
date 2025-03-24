<template>
  <div class="doc-pages-pr">
    <layout-content>
      <!-- 侧边栏 -->
      <template #aside-end v-if="isAsideDocMenu">
        <layout-content-aside-card class="sideMenu" v-if="menuTree.length">
          <template #title>
            <i class="i-material-symbols:menu-rounded"></i>
            <span>目录</span>
          </template>
          <template #body>
            <vditor-menu :menuData="menuTree" :observerMenu> </vditor-menu>
          </template>
        </layout-content-aside-card>
      </template>
      <!-- 内容区 -->
      <template #content-start>
        <template v-if="isShowHeader">
          <!-- 头部 -->
          <teleport to="body" v-if="article">
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
                      <span
                        class="content cur-text doc-header-link cur-pointer"
                      >
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
                      <span class="content cur-text"
                        >{{ numberTransform(article?.length) }}字</span
                      >
                    </div>
                    <span class="item-hr">|</span>
                    <div class="item-data">
                      <span class="label cur-text"
                        ><i class="i-mingcute:refresh-3-line"></i
                        >阅读时长:</span
                      >
                      <span class="content cur-text">
                        <article-times :article="article"></article-times>
                      </span>
                    </div>
                    <span class="item-hr">|</span>
                    <div class="item-data">
                      <span class="label cur-text"
                        ><i class="i-mingcute:refresh-3-line"></i>浏览量:</span
                      >
                      <span class="content cur-text">
                        <article-counts :article="article"></article-counts>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </teleport>
        </template>
        <!-- 卡片 -->
        <div class="doc-content" ref="docRef">
          <div
            class="observer-menu"
            v-if="asideCounts"
            ref="observerMenu"
          ></div>
          <my-card class="card_style">
            <!-- 预览 -->
            <vditor-preview
              v-model:article="article"
              v-model:menuTree="menuTree"
              v-model:title="title"
            ></vditor-preview>
            <!-- 评论 -->
            <layout-article-comments
              :articleId="article?.id"
              :author="article.author"
              v-if="!settingId && article?.id && article?.id >= 0"
            ></layout-article-comments>
            <!-- 设置表的 存储杂项的表 评论 -->
            <layout-article-comments
              :settingId
              v-if="!article?.id && settingId && settingId >= 0 && settingId"
            ></layout-article-comments>
          </my-card>
        </div>
      </template>
    </layout-content>
  </div>
</template>

<script setup lang="ts" name="DocumentReview">
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import type { TocNode } from "./types"
// 引入 moment
import moment from "@/utils/moment"
// 引入计数 转换函数
import { numberTransform } from "@/utils/Math"
// 引入 仓库
import { useSettingStore } from "@/store/setting"
// 引入 子组件
import ArticleCounts from "./counts/index.vue"
import ArticleTimes from "./times/index.vue"

// 提取数据
const { isAsideDocMenu, asideCounts } = storeToRefs(useSettingStore())

// 存储文章
const article = ref<GetOneArticle["data"]>()
const title = defineModel<string>("title")
// 设置 的 id
const settingId = defineModel<number>("settingId")

// 注入父组件提供的方法
const reqArticle =
  inject<() => Promise<GetOneArticle["data"] | undefined>>("reqArticle")
withDefaults(defineProps<{ isShowHeader?: boolean }>(), {
  isShowHeader: true,
})
// 初始化
onBeforeMount(async () => {
  if (!reqArticle) return
  const result = await reqArticle()
  if (result) article.value = result
})

// 存储目录树
const menuTree = ref<TocNode[]>([])

// 侧边栏 固定需要用到的容器
const observerMenu = ref<HTMLDivElement | undefined>()
</script>

<style scoped lang="scss">
// 引入 函数
@use "sass:map";

$header-t: 150px;
$desc-gap: 10px;
$hr-m-hor: 10px;
$author-m: 10px 0;
$icon-m-r: 2px;
$header-h: 18.75rem;
$header-container-h: 12.5rem;

// 设置 侧边栏标题
@include content-aside-title(var(--aside-title-icon-bg));

// 设置 卡片 样式
@include setCardStyle;
// 头部 teleport body了
.doc-pages-header {
  position: absolute;
  width: 100%;
  height: $header-h;
  top: $header-t;
  z-index: $global-content-index;
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
}
// 模块样式
.doc-pages-pr {
  .observer-menu {
    $height: 12.5rem;
    position: absolute;
    top: -$height - 1.875rem;
    left: 0;
    height: $height;
    width: $height;
    cursor: pointer;
    pointer-events: none;
  }
}
</style>
