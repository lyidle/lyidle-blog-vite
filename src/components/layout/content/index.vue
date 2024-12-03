<template>
  <context-menu>
    <div class="pages">
      <div class="container">
        <slot name="content-start"></slot>
        <div class="contain">
          <slot name="content-card"></slot>
        </div>
        <slot name="content-end"></slot>
      </div>
      <div class="content-aside" v-if="isAside" :style="asideStyle">
        <slot name="aside-start"></slot>
        <layout-content-introduce-self />
        <layout-content-announce />
        <layout-content-web-info />
        <layout-content-recent-pages />
        <slot name="aside-end"></slot>
      </div>
    </div>
    <template #body>
      <layout-content-menu />
    </template>
  </context-menu>
</template>

<script setup lang="ts" name="Content">
import { useSettingStore } from "@/store/setting"
const { cardBoxShadow, isAside, contentIsReverse } = storeToRefs(
  useSettingStore()
)
// 中间内容区域 卡片个数
const contentNum = computed(() => {
  return isAside.value ? 3 : 4
})
const asideStyle = computed(() => {
  const result: any = {}
  if (contentIsReverse.value) {
    result.margin = "unset"
    result.marginLeft = "var(--content-gap)"
    result.order = "unset"
  } else {
    result.margin = "unset"
    result.marginRight = "var(--content-gap)"
    result.order = "-1"
  }
  return result
})
</script>
<style scoped lang="scss">
// 左右间距
$item-gap: var(--content-gap);
$translate-y: -5px;
$aside-pd: 20px;
.pages {
  width: var(--content-width);
  inset: 0;
  margin: auto;
  padding-top: $item-gap;
  transition: width var(--header-bg-during);
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $item-gap;
  }
  /* 左边内容区 */
  .contain {
    width: 100%;
    display: flex;
    // 内容区域卡片的间距
    gap: $item-gap;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;
    // 610px
    @media screen and (max-width: $scr-mi) {
      display: flex;
      justify-content: center;
    }
    ::v-deep(.title) {
      a {
        @include pages-links-hover;
      }
    }
    // 内容区的卡片
    ::v-deep(.content) {
      flex: 0 0 calc(100% / v-bind(contentNum) - $item-gap);
      transition: transform var(--primary-during),
        flex var(--content-card-flex-during);
      box-shadow: v-bind(cardBoxShadow);
      // 自适应1300px
      @media screen and (max-width: $scr-md) {
        flex: 0 0 calc(100% / v-bind(contentNum-1) - $item-gap);
      }
      // 992px
      @media screen and (max-width: $scr-sm) {
        flex: 0 0 calc(100% / v-bind(contentNum-2) - $item-gap);
      }
      // 768px
      @media screen and (max-width: $scr-xs) {
        flex: 0 0 calc(100% / v-bind(contentNum-2) - $item-gap);
      }
      @media screen and (max-width: $scr-mi) {
        flex: unset;
        width: 100%;
      }
      // 悬浮效果
      &:hover {
        transform: translateY($translate-y);
        .poster {
          transform: scale($recent-poster-scale);
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
  /* 右边侧边栏 */
  .content-aside {
    width: 350px;
    transition: width var(--primary-during);
    display: flex;
    flex-direction: column;
    gap: $item-gap;
    // 自适应1300px
    @media screen and (max-width: $scr-md) {
      width: 300px;
    }
    @media screen and (max-width: $scr-mi) {
      display: none;
    }
    ::v-deep(.item-aside) {
      position: relative;
      padding: $aside-pd;
      border-radius: var(--pages-card-radius);
      // transition: transform var(--primary-during);
      // &:hover {
      //   transform: translateY($translate-y);
      // }
    }
  }
  // 卡片颜色
  ::v-deep(.myCard) {
    background-color: var(--pages-card-bg);
    color: var(--primary-color);
    box-shadow: v-bind(cardBoxShadow);
  }
}
</style>
