<template>
  <div ref="container">
    <slot></slot>
    <teleport to="body">
      <!-- 阻止冒泡 防止多个菜单干扰 -->
      <div class="menu-context" ref="menu" @contextmenu.capture.prevent.stop>
        <div class="title">
          <div class="icon" onclick="history.back()">
            <i class="i-lets-icons:arrow-left"></i>
          </div>
          <div class="icon" onclick="history.forward()">
            <i class="i-lets-icons:arrow-right"></i>
          </div>
          <div class="icon" onclick="location.reload()">
            <i class="i-tabler:refresh"></i>
          </div>
          <div class="icon" @click="scrollTop">
            <i class="i-lets-icons:arrow-top"></i>
          </div>
          <div class="icon" @click="scrollBottom">
            <i class="i-lets-icons:arrow-down"></i>
          </div>
        </div>
        <context-menu-item
          :content="bannerIsFixed ? '背景固定' : '背景悬浮'"
          :icon="!bannerIsFixed ? 'i-f7:snow' : 'i-mdi:snowflake-melt'"
          @click="bannerIsFixed = !bannerIsFixed"
        >
        </context-menu-item>
        <context-menu-item
          :content="!isDark ? '暗夜模式' : '白天模式'"
          :icon="!isDark ? 'i-ep-moon-night' : 'i-ep:sunny'"
          @click="isDark = !isDark"
        >
        </context-menu-item>
        <context-menu-item
          :content="isFullScreen ? '退出全屏' : '进入全屏'"
          :icon="
            isFullScreen
              ? 'i-tdesign:fullscreen-exit'
              : 'i-tdesign:fullscreen-1'
          "
          :onclick="screen?.fullScreenCb"
        >
        </context-menu-item>
        <context-menu-item
          :content="'打印页面'"
          :icon="'i-material-symbols-light:print'"
          onclick="window.print()"
        ></context-menu-item>
        <slot name="body"></slot>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts" name="context-menu">
// 引入仓库
import { useSettingStore } from "@/store/setting"
const { isDark, bannerIsFixed, isFullScreen } = storeToRefs(useSettingStore())
// 引入 utils
import useFullScreen from "@/hooks/fullscreen"
const menu = ref()
// 菜单绑定的元素
const container = ref()
// 菜单的高宽
const menuHeigh = ref()
const menuWidth = ref()
// 打开菜单
const open = (e: MouseEvent) => {
  menu.value.style.height = "0"
  e.preventDefault()
  e.stopPropagation()
  let x = e.clientX
  let y = e.clientY
  const windowX =
    document.documentElement.clientWidth - parseFloat(menuWidth.value)
  const windowY =
    document.documentElement.clientHeight - parseFloat(menuHeigh.value)
  // 处理边界
  x >= windowX ? (x = windowX) : x
  y >= windowY ? (y = windowY) : y
  menu.value.style.height = menuHeigh.value
  menu.value.style.transition = "height .5s"
  menu.value.style.top = `${y}px`
  menu.value.style.left = `${x}px`
}
// 关闭菜单
const close = (e: MouseEvent) => {
  if (menu.value) menu.value.style.height = "0"
}
// 回到顶部
const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}
// 到达底部
const scrollBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  })
}

// 全屏
const screen = useFullScreen()

onMounted(() => {
  // 记录高度
  menuHeigh.value = menu.value.offsetHeight + "px"
  menuWidth.value = menu.value.offsetWidth + "px"
  menu.value.style.height = "0"
  container.value.addEventListener("contextmenu", open)
  //使用捕获 先关闭 再打开菜单 防止多个菜单出现
  window.addEventListener("click", close, true)
  window.addEventListener("contextmenu", close, true)
})
// onUnmounted(() => {
//   console.log(container.value) //null
//   // 限制 vite好像自动移除了
//   container.value.removeEventListener("contextmenu", open)
// })
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
  z-index: 50;
  background-color: var(--header-menu-bg);
  color: var(--header-menu-color);
  border-radius: $wrap-radius;
  overflow: hidden;
  & > div {
    min-width: $item-min-w;
    min-height: $item-min-h;
    font-size: 15px;
  }
  .title {
    display: flex;
    justify-content: center;
    gap: $title-gap;
    border-bottom: 1px solid #c9c9c9;
    padding: $item-gap;
    .icon {
      padding: $title-icon-pd;
      border-radius: $item-radius;
      cursor: var(--cursor-pointer);
      i {
        font-size: $item-icon-size;
      }
      &:hover {
        background-color: var(--header-menu-bg-hover);
        color: var(--header-menu-color-hover);
      }
    }
  }
}
</style>
