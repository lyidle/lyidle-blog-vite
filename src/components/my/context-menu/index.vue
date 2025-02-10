<template>
  <div ref="menucontainer">
    <slot></slot>
    <!-- 阻止冒泡 防止多个菜单干扰 -->
    <div
      class="menu-context"
      ref="menuInstance"
      @contextmenu.capture.prevent.stop
    >
      <div class="title">
        <div class="icon" @click="goBack">
          <i class="i-lets-icons:arrow-left"></i>
        </div>
        <div class="icon" @click="$router.go(1)">
          <i class="i-lets-icons:arrow-right"></i>
        </div>
        <div class="icon" @click="fullScreenEmit">
          <i
            :class="
              isFullscreen
                ? 'i-tdesign:fullscreen-exit'
                : 'i-tdesign:fullscreen-1'
            "
          ></i>
        </div>
        <div class="icon" @click="$router.go(0)">
          <i class="i-tabler:refresh"></i>
        </div>
        <div class="icon" @click="scrollTop">
          <i class="i-lets-icons:arrow-top"></i>
        </div>
        <div class="icon" @click="scrollBottom">
          <i class="i-lets-icons:arrow-down"></i>
        </div>
      </div>
      <my-context-menu-item
        :content="`背景${bannerIsFixed ? '悬浮' : '固定'}`"
        :icon="!bannerIsFixed ? 'i-f7:snow' : 'i-mdi:snowflake-melt'"
        @click="bannerIsFixed = !bannerIsFixed"
      >
      </my-context-menu-item>
      <my-context-menu-item
        v-if="themes === 'switch'"
        :content="`${isDark ? '暗夜' : '白天'}模式`"
        :icon="isDark ? 'i-ep-moon-night' : 'i-ep:sunny'"
        @click="isDark = !isDark"
      >
      </my-context-menu-item>
      <my-context-menu-item
        :content="'个性化设置'"
        :icon="'i-basil:edit-outline'"
        @click="openSettings"
      ></my-context-menu-item>
      <my-context-menu-item
        :content="'复制文本'"
        :icon="'i-material-symbols-light:print'"
        @click="handleContextMenu"
        v-if="isCopyText"
      ></my-context-menu-item>
      <my-context-menu-item
        :content="'打印页面'"
        :icon="'i-material-symbols-light:print'"
        onclick="window.print()"
      ></my-context-menu-item>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="ContextMenu">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 到顶部和底部的函数
import { scrollTop, scrollBottom } from "@/utils/toTopOrBottom"
// 引入 菜单 核心
import { useContextMenu } from "@/hooks/context-menu/base"

// 引入 复制到剪贴板的方法
import { handleContextMenu } from "@/hooks/context-menu/copyToClipboard"
import { mitt } from "@/utils/emitter"
// 回到上一个路径
import { useGoBack } from "@/hooks/useGoBack"
const goBack = useGoBack()
// 提取需要的变量
const {
  isDark,
  themes,
  bannerIsFixed,
  isFullscreen,
  setScene,
  isShowPanel,
  isCopyText,
} = storeToRefs(useSettingStore())

// 菜单绑定的元素
const menuInstance = ref()
const menucontainer = ref()

// 初始化 菜单
useContextMenu(menuInstance, menucontainer)

// 判断 是打开那个个性化面板
const props = defineProps<{ scene?: string | number }>()

// 打开 个性化设置
const openSettings = () => {
  isShowPanel.value = true
  if (props.scene) setScene.value = props.scene
}

const fullScreenEmit = () => {
  mitt.emit("fullScreenChange", document.documentElement)
}
</script>

<style scoped lang="scss">
$wrap-radius: 5px;
$title-gap: 5px;
$title-icon-pd: 3px;
$item-m: 8px;
$item-min-w: 100px;
$item-min-h: 30px;
$item-icon-size: 20px;
$item-radius: 5px;
$item-gap: 5px;
.menu-context {
  position: fixed;
  z-index: $menu-context-index;
  background-color: var(--context-menu-bg);
  color: var(--context-menu-color);
  border-radius: $wrap-radius;
  overflow: hidden;
  box-shadow: var(--context-menu-shadow);
  & > div {
    min-width: $item-min-w;
    min-height: $item-min-h;
    font-size: 15px;
  }
  .title {
    display: flex;
    justify-content: center;
    gap: $title-gap;
    border-bottom: var(--context-menu-title-hr);
    padding: $item-gap;
    .icon {
      padding: $title-icon-pd;
      border-radius: $item-radius;
      cursor: var(--cursor-pointer);
      i {
        font-size: $item-icon-size;
      }
      &:hover {
        background-color: var(--context-menu-bg-hover);
        color: var(--context-menu-color-hover);
      }
    }
  }
}
</style>
