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
            >
              <template #btns>
                <div class="flex gap-15px">
                  <!-- 点赞 -->
                  <div
                    class="moment-like cur-pointer flex flex-col gap-5px h-42px justify-between !hover:color-[var(--primary-links-hover)]"
                  >
                    <i
                      class="text-15px i-uiw:like-o w-1em h-1em"
                      :class="`${isLike ? 'active' : ''}`"
                    ></i>
                    {{ 60 }}
                  </div>
                  <!-- 收藏 -->
                  <div
                    class="moment-like cur-pointer flex flex-col gap-5px h-42px justify-between !hover:color-[var(--primary-links-hover)]"
                  >
                    <i
                      class="text-16px i-solar:star-linear w-1em h-1em"
                      :class="`${isLike ? 'active' : ''}`"
                    ></i>
                    {{ 60 }}
                  </div>
                  <!-- 分享 -->
                  <div
                    class="moment-like cur-pointer flex flex-col gap-5px h-42px justify-between !hover:color-[var(--primary-links-hover)]"
                  >
                    <i
                      class="text-17px i-bitcoin-icons:share-outline w-1em h-1em"
                      :class="`${isLike ? 'active' : ''}`"
                    ></i>
                    {{ 60 }}
                  </div>
                  <div
                    class="moment-like cur-pointer flex flex-col gap-5px h-42px justify-between text-color-[var(--primary-color)] !hover:text-color-[var(--primary-links-hover)]"
                  >
                    <icon-parse
                      :icon="`<svg t='1742823144748'  viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='4471' width='200' height='200'><path d='M861.2 59H164.8C75.6 59 3 131.6 3 220.9v416.9C3 727 75.6 799.6 164.8 799.6h201.5L527.2 965l162.2-165.5h171.8c89.2 0 161.8-72.6 161.8-161.8V220.9C1023 131.6 950.4 59 861.2 59z m132.4 578.7c0 73-59.4 132.4-132.4 132.4H677.1L527.4 922.9 378.8 770.1h-214c-73 0-132.4-59.4-132.4-132.4V220.9c0-73 59.4-132.4 132.4-132.4h696.3c73 0 132.4 59.4 132.4 132.4l0.1 416.8z' fill='currentColor' p-id='4472'></path><path d='M216.3 279.7h492.8v29.4H216.3v-29.4zM795.2 294.4c0 9.3 7.6 16.9 16.9 16.9 9.3 0 16.9-7.6 16.9-16.9 0-9.3-7.6-16.9-16.9-16.9-9.4 0-16.9 7.5-16.9 16.9zM216.3 425.6h492.8V455H216.3v-29.4z m595.8-2.2c-9.3 0-16.9 7.6-16.9 16.9s7.6 16.9 16.9 16.9c9.3 0 16.9-7.6 16.9-16.9s-7.5-16.9-16.9-16.9zM216.3 545.8h492.8v29.4H216.3v-29.4z m595.8-2.2c-9.3 0-16.9 7.6-16.9 16.9s7.6 16.9 16.9 16.9c9.3 0 16.9-7.6 16.9-16.9 0-9.4-7.5-16.9-16.9-16.9z' fill='currentColor' p-id='4473'></path></svg>`"
                      class="text-15px w-1em h-1em"
                    >
                    </icon-parse>
                    {{ 60 }}
                  </div>
                </div>
              </template>
            </vditor-preview>
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
// 文章 的点赞
const isLike = ref(false)

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
  // 点赞和点菜
  ::v-deep(.moment-like) {
    &.active {
      color: rgb(217, 62, 62);
    }
  }
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
