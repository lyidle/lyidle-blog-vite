<template>
  <global-animations-ornaments></global-animations-ornaments>
  <global-tools></global-tools>
  <div
    class="global-content"
    :style="{ marginTop: `${$route.meta.pagesMt}` }"
    @contextmenu="mitt.emit('isContentMenu')"
  >
    <div class="pages">
      <div
        class="pages-content"
        :style="{ width: isShowAside ? undefined : '100%' }"
      >
        <slot name="content-start"></slot>
        <div class="contain" :style="{ '--pages-card-contentNum': contentNum }">
          <slot name="content-card"></slot>
        </div>
        <slot name="content-end"></slot>
      </div>
      <div class="content-aside" v-if="isShowAside" :style="asideStyle">
        <slot name="aside-start"></slot>
        <layout-content-introduce-self v-if="isAsideSelf" />
        <layout-content-announce v-if="isAsideAnnounce" />
        <layout-content-web-info v-if="isAsideWebInfo" />
        <layout-content-recent-pages v-if="isAsideRecentPage" />
        <slot name="aside-secend-end"></slot>
        <slot name="aside-end"></slot>
      </div>
    </div>
    <slot name="outer"></slot>
  </div>
  <!-- footer -->
  <div class="h-30vh w-100% bg-red"></div>
</template>

<script setup lang="ts" name="Content">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入mitt
import { mitt } from "@/utils/emitter"
// 提取需要的变量
const {
  contentIsReverse,
  isAside,
  isAsideSelf,
  isAsideAnnounce,
  isAsideWebInfo,
  isAsideRecentPage,
  asideCounts,
  isAsideDocMenu,
} = storeToRefs(useSettingStore())

// 中间内容区域 卡片个数
const contentNum = computed(() => {
  return isShowAside.value ? 3 : 4
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

// 存储是否有 目录的数据
let isToc = ref(false)

const isShowAside = computed(() => {
  let result = 0
  // 是否关闭侧边栏
  if (!isAside.value) {
    result = 0
    return result
  }
  // 在没有目录的组件 且目录开启
  if (!isToc.value && isAsideDocMenu.value) {
    result = asideCounts.value - 1
    return result
  }
  // 在没有目录的组件 且目录关闭
  if (!isToc.value && !isAsideDocMenu.value) {
    result = asideCounts.value
    return result
  }

  // 有目录的组件 中 目录存在数据
  if (isAsideDocMenu.value && isToc.value) {
    result = asideCounts.value
    return result
  }

  // 有目录的组件 中 目录不存在数据
  if (isAsideDocMenu.value) {
    result = asideCounts.value - 1
    return result
  }
})

// 订阅 接受目录
mitt.on("articleMenu", (toc) => {
  if (toc.length) {
    isToc.value = true
  }
})

// 订阅 有目录的组件销毁时 触发
mitt.on("articleMenu:destroy", () => {
  isToc.value = false
})

// 监听 布局切换事件
watch(
  () => contentIsReverse.value,
  () => {
    mitt.emit("contentIsReverse")
  }
)

// 监听侧边栏的个数变化
watch(
  () => asideCounts.value,
  () => {
    mitt.emit("asideCounts")
  }
)

// 监听 菜单关闭与隐藏
watch(
  () => isAside.value,
  (newV) => {
    newV && mitt.emit("isAside")
  }
)
onBeforeUnmount(() => {
  mitt.off("articleMenu")
  mitt.off("articleMenu:destroy")
})

defineExpose({ contentNum })
</script>
<style scoped lang="scss">
// 左右间距
$item-gap: var(--content-gap);
$translate-y: -5px;
$aside-pd: 20px;
$aside-width: var(--aside-width);
.global-content {
  @include media(mi) {
    width: 100%;
    overflow: hidden;
  }
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
    z-index: $global-content-index;

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
          flex: 0 0 calc(100% / var(--pages-card-contentNum) - $item-gap);
          transition: transform var(--primary-during),
            flex var(--content-card-flex-during);
          @include media(md) {
            flex: 0 0
              calc(100% / (var(--pages-card-contentNum) - 1) - $item-gap);
          }
          @include media(sm) {
            flex: 0 0
              calc(100% / (var(--pages-card-contentNum) - 2) - $item-gap);
          }
          @include media(xs) {
            flex: 0 0
              calc(100% / (var(--pages-card-contentNum) - 2) - $item-gap);
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
  }
}
</style>
