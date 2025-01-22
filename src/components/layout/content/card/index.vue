<template>
  <my-card class="layout-content">
    <div class="content-header">
      <router-link :to="`/doc/${article.id}`">
        <img
          class="poster scale-[1.01]"
          :style="{
            background: 'no-repeat center',
            backgroundSize: 'cover',
            backgroundImage: article.poster
              ? article.poster
              : 'var(--default-img)',
          }"
          alt=""
        />
      </router-link>
      <div class="mask">
        <div class="poster-container line-clamp-2">『{{ article.desc }}』</div>
        <div class="pin">
          <i class="i-mynaui:pin-solid"></i>
        </div>
      </div>
    </div>
    <div class="content-info">
      <div class="title">
        <router-link
          :to="`/doc/${article.id}`"
          class="line-clamp-2 p-x-20px text-center"
        >
          <span class="route-link">
            {{ article.title }}
          </span>
        </router-link>
      </div>
      <div class="meta-contain">
        <div class="info-meta">
          <div class="item cur-text">
            <i class="i-oui:token-date font-size-17px"></i>
            {{ moment(article.createdAt) }}
          </div>
          <div class="item cur-text">
            <i class="i-mingcute:refresh-3-line font-size-15px mr-1px" />
            {{ moment(article.updatedAt) }}
          </div>
        </div>
        <div class="info-meta">
          <div class="item">
            <i class="i-tabler:clover-filled font-size-14px mr-2px" />
            <router-link
              :to="`/user/categories?author=${article.author}&category=${article.category}`"
            >
              <div class="item route-link">
                <span class="max-w-110px truncate">
                  {{ article.category }}
                </span>
              </div>
            </router-link>
          </div>
          <div class="item">
            <div class="item max-w-110px truncate" style="display: block">
              <i
                class="i-mynaui:label-solid font-size-14px mr-2px translate-y-3px"
              />
              <template v-for="(item, index) in article.tags" :key="item">
                <router-link
                  :to="`/user/tags?author=${article.author}&tags=${item}`"
                >
                  <span class="route-link">{{ item }}</span>
                  <span v-if="index !== article.tags.length - 1" class="m-x-2px"
                    >•</span
                  >
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </my-card>
</template>

<script setup lang="ts" name="ContentCard">
// 引入moment格式化时间
import moment from "@/utils/moment"
// 引入 类型
import type { Article } from "@/api/article/types/getArticle"
defineProps<{
  article: Article
}>()
</script>

<style scoped lang="scss">
// 高度
$content-height: 350px;
$header-height: 200px;
// 底部信息高度
$content-info-height: $content-height - $header-height;
$title-m-t: 35px;
$title-m-b: 10px;
// 底部源信息 距离
$meta-gap: 5px;
.layout-content {
  // 设置 卡片 阴影
  @include setCardShadow;
  height: $content-height;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: var(--pages-card-radius);
  overflow: hidden;
  // 头部
  .content-header {
    position: relative;
    overflow: hidden;
    height: $header-height;
    // 头部遮罩 图片
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      pointer-events: none;
      background-image: var(--content-mask);
      font-size: 1rem;
      color: white;
      // 置顶
      .pin {
        position: absolute;
        top: 0;
        left: 0;
        width: 1.875rem;
        height: 1.875rem;
        background-color: var(--content-card-pin-bg);
        clip-path: polygon(0 0, 0% 100%, 100% 0);
        i {
          position: absolute;
          top: 1px;
          left: 2px;
          color: var(--content-card-pin-color);
        }
      }
      .poster-container {
        $height: 80px;
        width: 70%;
        height: $height;
        text-align: center;
        line-height: calc($height / 2);
        font-size: 1rem;
        overflow: hidden;
        inset: 0;
        margin: auto;
        position: absolute;
      }
    }
  }
  // 卡片底部内容
  .content-info {
    height: $content-info-height;
    position: relative;
    // 副标题
    .title {
      font-size: 1.1875rem;
      font-weight: 600;
      margin-top: $title-m-t;
      margin-bottom: $title-m-b;
      overflow: hidden;
    }
    // 源信息
    .info-meta {
      font-size: 0.8125rem;
      display: flex;
      justify-content: center;
      &:not(:last-child) {
        margin-bottom: $meta-gap;
      }
      .item {
        display: flex;
        align-items: center;
        // 除了最后的都有竖着的分割线
        &:not(:last-child) {
          border-right: 1px solid var(--primary-color);
        }
        // 选中奇数odd 设置 右边框
        &:nth-child(2n-1) {
          padding-right: 3px;
        }
        // 选中偶数even 设置 左边框
        &:nth-child(2n) {
          padding-left: 3px;
        }
      }
    }
  }
}
</style>
