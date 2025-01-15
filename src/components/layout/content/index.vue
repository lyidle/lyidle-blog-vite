<template>
  <context-menu>
    <div class="pages">
      <div
        class="pages-content"
        :style="{ width: isAside ? undefined : '100%' }"
      >
        <slot name="content-start"></slot>
        <div class="contain">
          <slot name="content-card"></slot>
        </div>
        <slot name="content-end"></slot>
      </div>
      <div class="content-aside" v-if="isAside" :style="asideStyle">
        <slot name="aside-start"></slot>
        <layout-content-introduce-self v-if="isAsideSelf" />
        <layout-content-announce v-if="isAsideAnnounce" />
        <layout-content-web-info v-if="isAsideWebInfo" />
        <layout-content-recent-pages v-if="isAsideRecentPage" />
        <slot name="aside-end"></slot>
      </div>
    </div>
    <template #body>
      <layout-content-menu />
    </template>
    <slot name="outer"></slot>
  </context-menu>
</template>

<script setup lang="ts" name="Content">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 提取需要的变量
const {
  isAside,
  contentIsReverse,
  isAsideSelf,
  isAsideAnnounce,
  isAsideWebInfo,
  isAsideRecentPage,
} = storeToRefs(useSettingStore())
// 中间内容区域 卡片个数
const contentNum = computed(() => {
  return isAside.value ? 3 : 4
})
const asideStyle = computed(() => {
  const result: any = {}
  if (contentIsReverse.value) {
    result.margin = "unset"
    result.order = "-1"
  } else {
    result.margin = "unset"
    result.order = "unset"
  }
  return result
})
</script>
<style scoped lang="scss">
// 左右间距
$item-gap: var(--content-gap);
$translate-y: -5px;
$aside-pd: 20px;
$aside-width: var(--aside-width);
.pages {
  color: var(--primary-color);
  width: var(--content-width);
  inset: 0;
  margin: auto;
  padding-top: $item-gap;
  transition: width var(--header-bg-initial-during);
  display: flex;
  justify-content: space-between;
  gap: $item-gap;
  position: relative;
  z-index: 2;
  /* 左边内容区 */
  > .pages-content {
    width: calc(100% - $aside-width);
    display: flex;
    flex-direction: column;
    gap: $item-gap;
    @include media(mi) {
      width: 100%;
    }
    // 内容区域卡片
    .contain {
      width: 100%;
      display: flex;
      // 内容区域卡片的间距
      gap: $item-gap;
      flex-wrap: wrap;
      justify-content: space-between;
      @include media(sm) {
        justify-content: center;
      }
      // 内容区的卡片
      ::v-deep(.layout-content) {
        flex: 0 0 calc(100% / v-bind(contentNum) - $item-gap);
        transition: transform var(--primary-during),
          flex var(--content-card-flex-during);
        @include media(md) {
          flex: 0 0 calc(100% / v-bind(contentNum-1) - $item-gap);
        }
        @include media(sm) {
          flex: 0 0 calc(100% / v-bind(contentNum-2) - $item-gap);
        }
        @include media(xs) {
          flex: 0 0 calc(100% / v-bind(contentNum-2) - $item-gap);
        }
        @include media(mi) {
          flex: unset;
          width: 100%;
        }
        // 悬浮效果
        &:hover {
          transform: translateY($translate-y);
          .poster {
            transform: scale($pages-poster-scale);
          }
        }
        &:last-child {
          margin-right: auto;
        }
        // 海报
        .poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--primary-during) transform;
        }
      }
    }
  }
  /* 右边侧边栏 */
  .content-aside {
    width: $aside-width;
    transition: width var(--primary-during);
    display: flex;
    flex-direction: column;
    gap: $item-gap;
    @include media(mi) {
      width: 0;
      overflow: hidden;
    }
    ::v-deep(.item-aside) {
      position: relative;
      padding: $aside-pd;
      border-radius: var(--pages-card-radius);
    }
  }
  // 卡片颜色
  ::v-deep(.myCard) {
    background-color: var(--pages-card-bg);
  }
}
</style>
