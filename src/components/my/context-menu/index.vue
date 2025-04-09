<template>
  <div class="menu-context">
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
      content="删除信息"
      icon="i-material-symbols-light:delete-forever-outline"
      v-if="isDelPop"
      @click="handlerDelPopMsg"
    ></my-context-menu-item>
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
      :content="isUserEditor ? '编辑用户' : '面板界面'"
      :icon="isUserEditor ? 'i-basil:edit-outline' : 'i-mynaui:panel-top'"
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
    <!-- 内容区域的 菜单 -->
    <layout-content-menu v-if="isContent" />
  </div>
</template>

<script setup lang="ts" name="ContextMenu">
// 引入 接口
import { delUserMsg } from "@/api/user/msg"
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
import { handlerReqErr } from "@/utils/request/error/successError"

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

// 初始化 菜单
/**
 * @isContent 是否是内容区域的 菜单事件
 * @isUserEditor 是否是自我介绍区域的 菜单事件
 * @isContextMenuTransitioned 是否是自我介绍区域的 菜单事件 重置使用的监听 transitionend 来进行
 * 因为点击时关闭菜单直接 isUserEditor变量为 false 会出现 打开面板不在 用户编辑界面
 */
const { isContent, isUserEditor, isContextMenuTransitioned, isDelPop } =
  useContextMenu()
// 内容区域
const isContentMenu = () => {
  isContent.value = true
}
// 自我介绍区域
const isUserEditorMenu = () => {
  isUserEditor.value = true
  isContextMenuTransitioned.value = true
}

// 内容区域
mitt.on("isContentMenu", isContentMenu)
// 自我介绍区域
mitt.on("isUserEditorMenu", isUserEditorMenu)

// 删除 消息
const handlerDelPopMsg = async () => {
  if (typeof delPopData !== "number") return
  try {
    await delUserMsg(delPopData)
    ElMessage.success("删除消息成功")
    mitt.emit("popmsgDelComplete", delPopData)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("删除消息失败")
  }
}

let delPopData: null | number = null
// 发送消息的气泡
const isSendPopMenu = (id: number) => {
  isDelPop.value = true
  delPopData = null
  delPopData = id
}
mitt.on("isSendPopMenu", isSendPopMenu)
onBeforeUnmount(() => {
  mitt.off("isContentMenu", isContentMenu)
  mitt.off("isUserEditorMenu", isUserEditorMenu)
  mitt.off("isSendPopMenu", isSendPopMenu)
})

// 打开 全局面板
const openSettings = () => {
  if (isContextMenuTransitioned.value) {
    setScene.value = 1
  }
  isShowPanel.value = true
}
// 全屏事件
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
