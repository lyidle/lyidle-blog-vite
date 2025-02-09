<template>
  <div class="tools-container">
    <div
      class="settings"
      ref="settings"
      @mouseenter="settingsEnter"
      @mouseleave="settingsLeave"
    >
      <!-- 暗夜切换 -->
      <div class="tools-item cur-pointer">
        <div class="icon" @click="isDark = !isDark">
          <i
            :class="
              isDark
                ? 'i-ep-moon-night m-t-0.3125rem size-1.25rem'
                : 'i-ep:sunny m-t-0.3125rem size-1.25rem'
            "
          ></i>
        </div>
      </div>
      <!-- 右键菜单美化 -->
      <div class="tools-item cur-pointer">
        <div class="icon" @click="isContextMenu = !isContextMenu">
          <i
            class="i-material-symbols-light:mouse m-t-0.3125rem size-1.5625rem"
          ></i>
        </div>
      </div>
      <!-- 音乐 -->
      <div class="tools-item cur-pointer">
        <div class="icon" @click="isMusic = !isMusic">
          <i
            class="i-flowbite:music-alt-solid m-t-0.3125rem size-1.5625rem"
          ></i>
        </div>
      </div>
    </div>
    <!-- setting -->
    <div
      class="tools-item cur-pointer"
      @mouseenter="settingsEnter"
      @mouseleave="settingsLeave"
    >
      <div class="icon">
        <i class="i-mage:settings-fill m-t-0.3125rem size-1.25rem setting"></i>
      </div>
    </div>
    <!-- up -->
    <div class="tools-item cur-pointer">
      <div v-if="upValue">
        {{ upValue === 1 ? 0 : upValue }}
      </div>
      <div v-else class="icon" @click="scrollTop">
        <i class="i-lets-icons:arrow-alt-ltop m-t-0.3125rem size-1.875rem"></i>
      </div>
    </div>
    <!-- down -->
    <div class="tools-item cur-pointer">
      <div v-if="downValue">
        {{ downValue }}
      </div>
      <div v-else class="icon" @click="scrollBottom">
        <i class="i-lets-icons:arrow-alt-ldown m-t-0.1875rem size-1.875rem"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tools">
// 引入 上下的按钮 百分比动画的动画逻辑
import { useUpOrDown } from "@/hooks/side-tools/animations/upOrDown"
// 引入 settings 的动画逻辑
import { useSettingsAnimation } from "@/hooks/side-tools/animations/settings"
// 引入 到顶部和底部的函数
import { scrollTop, scrollBottom } from "@/utils/toTopOrBottom"
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 提取需要的变量
const { isDark, isContextMenu, isMusic } = storeToRefs(useSettingStore())

// 获取工具栏实列
const settings = ref<HTMLDivElement | undefined>()
// 使用 settings 的动画逻辑
const { settingsEnter, settingsLeave } = useSettingsAnimation(settings, 500)

// 使用 上下的按钮 百分比动画的动画逻辑
const { upValue, downValue } = useUpOrDown()
</script>

<style scoped lang="scss">
$bottom: 3.125rem;
$right: 0.625rem;
$size: 2.1875rem;
$radius: 0.625rem;
$m-b: 0.625rem;
$bg: #75a6c6;
$color: #e4f4ff;
.tools-container {
  position: fixed;
  width: $size;
  right: $right;
  bottom: $bottom;
  z-index: $global-tools-index;
  pointer-events: none;
  // 设置栏
  .settings {
    transform: translateX(150%);
    transition: transform var(--primary-during);
    .tools-item {
      margin-bottom: $m-b;
    }
  }
  // 每一项
  .tools-item {
    width: $size;
    height: $size;
    background-color: $bg;
    color: $color;
    border-radius: $radius;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: initial;

    &:not(:last-child) {
      margin-bottom: $m-b;
    }
    // 设置
    .setting {
      animation: setting-animate 6s infinite linear;
      animation-play-state: running;

      &:hover {
        animation-play-state: paused; // 悬停时暂停动画
      }
    }

    @keyframes setting-animate {
      from {
        transform: rotateZ(0);
      }
      to {
        transform: rotateZ(360deg);
      }
    }
  }
}
</style>
