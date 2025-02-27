<template>
  <div class="contain carousel card_style">
    <my-carousel v-bind="$attrs">
      <template #body="{ item }: { item: Datum }">
        <div class="data-item">
          <div class="poster">
            <router-link :to="`/doc/${item.id}`">
              <img
                :style="{
                  background: 'no-repeat center',
                  backgroundSize: 'cover',
                  // 转义url链接
                  backgroundImage: item.poster
                    ? `url('${escapeUrlForRegExp(item.poster)}')`
                    : 'var(--default-img)',
                }"
                class="scale-[1.01]"
                alt=""
              />
              <div class="mask"></div>
            </router-link>
          </div>
          <div class="content">
            <div class="date cur-text">
              {{ moment(item.updatedAt) }}
            </div>
            <div class="title line-clamp-1">
              <router-link :to="`/doc/${item.id}`">
                {{ item.title }}
              </router-link>
            </div>
            <div class="description cur-text line-clamp-3">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </template>
      <template #btns>
        <div></div>
      </template>
      <template #pre>
        <div>pre</div>
      </template>
      <template #next>
        <div>next</div>
      </template>
    </my-carousel>
  </div>
</template>

<script setup lang="ts" name="MyCarouselInstance">
import moment from "@/utils/moment"
// 处理 url
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 引入类型
import type { Datum } from "@/api/article/types/getCarousel"
</script>
<style scoped lang="scss">
$carousel-height: 260px;
$carousel-radius: 10px;
$poster-ml: 20px;
$poster-w: 330px;
$poster-h: 220px;
$content-gap: 10px;
$content-mini-pd: 10px 15px;
$content-mini-bg: rgba(238, 243, 255, 0.86);
$content-mini-radius: 5px;
$arrow-mt: 8px;
$arrow-mr: 10px;
$arrow-pd: 2px 10px;
$arrow-gap: 10px;

$arrow-color: var(--content-carousel-arrow-color);
$arrow-color-hover: var(--content-carousel-arrow-color-hover);
$arrow-bg: var(--content-carousel-arrow-bg);
$arrow-bg-hover: var(--content-carousel-arrow-bg-hover);

$arrow-radius: 5px;
$btns-width: 10px;
$btns-height: $btns-width;
$btns-height-active: 30px;

$btns-color: var(--content-carousel-btns-color);
$btns-color-hover: var(--content-carousel-btns-color-hover);
$btns-bg: var(--content-carousel-btns-bg);
$btns-bg-hover: var(--content-carousel-btns-bg-hover);
$btns-bg-active: var(--content-carousel-btns-bg-active);
$btns-bg-active-hover: var(--content-carousel-btns-bg-active-hover);

$btns-radius: 10px;
$btns-arrow-dur: 0.5s;
$mini-dur: 0.5s;
// 设置 卡片 样式
@include setCardStyle;
.contain {
  --content-pd-r: 40px;
  --content-pd-l: 30px;
  height: $carousel-height;
  overflow: hidden;
  border-radius: $carousel-radius;
  transition: width $mini-dur, height $mini-dur;
  // 每一项
  .data-item {
    width: 100%;
    height: $carousel-height;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    @include setCardStyle;
    transition: height $mini-dur;
    &:hover {
      img {
        transform: scale($pages-poster-scale);
      }
    }
    > .content {
      .title {
        a {
          @include pages-links-hover;
        }
      }
    }
    // 图片
    .poster {
      width: $poster-w;
      height: $poster-h;
      overflow: hidden;
      border-radius: var(--pages-card-radius);
      position: relative;
      margin-left: $poster-ml;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--primary-during);
      }
      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-image: var(--content-mask);
      }
    }
    // 内容
    > .content {
      width: 100%;
      padding-right: var(--content-pd-r);
      padding-left: var(--content-pd-l);
      display: flex;
      flex-direction: column;
      gap: $content-gap;
      font-size: 0.9375rem;
      text-align: justify;
      .title {
        font-size: 1.125rem;
        font-weight: bold;
      }
    }
  }
  // 切换按钮
  ::v-deep(.arrow) {
    // 重置属性
    all: unset;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    pointer-events: none;
    gap: $arrow-gap;
    margin-top: $arrow-mt;
    .item {
      all: unset;
      cursor: pointer;
      pointer-events: all;
      background-color: $arrow-bg;
      color: $arrow-color;
      padding: $arrow-pd;
      border-radius: $arrow-radius;
      transition: color $btns-arrow-dur, background-color $btns-arrow-dur;
      &:last-child {
        margin-right: $arrow-mr;
      }
      &:hover {
        background-color: $arrow-bg-hover;
        color: $arrow-color-hover;
      }
    }
  }
  // 指示器
  ::v-deep(.btn) {
    all: unset;
    cursor: pointer;
    pointer-events: none;
    height: 100%;
    display: flex;
    justify-content: center;
    cursor: pointer;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    flex-direction: column;
    .item {
      background-color: $btns-bg;
      color: $btns-color;
      width: $btns-width;
      height: $btns-height;
      border-radius: $btns-radius;
      &:hover {
        transition: color $btns-arrow-dur, background-color $btns-arrow-dur;
        background-color: $btns-bg-hover;
        color: $btns-color-hover;
      }
      &.active {
        width: unset;
        background-color: $btns-bg-active;
        height: $btns-height-active;
        &:hover {
          transition: color $btns-arrow-dur, background-color $btns-arrow-dur;
          background-color: $btns-bg-active-hover;
        }
      }
    }
  }
  @include media(xs) {
    $carousel-height: 400px;
    height: $carousel-height;
    .data-item {
      height: $carousel-height;
      flex-direction: column;
      justify-content: start;
      gap: 20px;
      padding: 0 var(--content-pd-l);
      padding-top: 40px;
      .poster {
        width: 100%;
        height: 200px;
        margin: 0;
      }
      > .content {
        padding: unset;
      }
    }
    // 指示器
    ::v-deep(.btn) {
      position: absolute;
      height: unset;
      right: 50%;
      top: unset;
      bottom: 0;
      transform: translateX(50%);
      flex-direction: unset;
      justify-content: unset;
      .item {
        width: 20px;
        height: $btns-height;
        &.active {
          width: 35px;
          height: $btns-height;
        }
      }
    }
  }
}
</style>
