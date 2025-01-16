<template>
  <a class="custom-popover-trigger custom-setting">
    <i class="i-hugeicons:setting-07 w-1em h-1em"></i>
    {{ label }}
    <my-popover
      :right
      :top
      :left
      :width
      :height
      :label
      :triangle
      bg="var(--header-setting-bg)"
    >
      <template #body>
        <el-form label-width="130px" class="m-5px m-l-15px header-setting">
          <el-form-item
            v-if="themes === 'switch'"
            :label="!isDark ? '暗夜模式' : '白天模式'"
            class="item"
          >
            <el-switch
              v-model="isDark"
              inline-prompt
              :active-icon="dark"
              :inactive-icon="light"
              size="small"
              class="settingSwitch"
            />
          </el-form-item>
          <el-form-item
            :label="bannerIsFixed ? '背景固定' : '背景悬浮'"
            class="item"
          >
            <el-switch
              v-model="bannerIsFixed"
              inline-prompt
              :active-icon="fixed"
              :inactive-icon="unfixed"
              size="small"
              class="settingSwitch"
            />
          </el-form-item>
          <el-form-item
            :label="!clickEffect ? '开启鼠标点击特效' : '关闭鼠标点击特效'"
            class="item"
          >
            <el-switch
              v-model="clickEffect"
              inline-prompt
              :active-icon="click"
              :inactive-icon="unclick"
              size="small"
              class="settingSwitch"
            />
          </el-form-item>
          <el-form-item
            :label="!moveEffect ? '开启鼠标移动特效' : '关闭鼠标移动特效'"
            class="item"
          >
            <el-switch
              v-model="moveEffect"
              inline-prompt
              :active-icon="move"
              :inactive-icon="unmove"
              size="small"
              class="settingSwitch"
            />
          </el-form-item>
          <template v-if="asideCounts">
            <el-form-item
              :label="isAside ? '关闭侧边信息' : '打开侧边信息'"
              class="item aside-switch"
              v-if="!docMenuIsFixedLazy"
            >
              <el-switch
                v-model="isAside"
                inline-prompt
                :active-icon="aside"
                :inactive-icon="unaside"
                size="small"
                class="settingSwitch"
              />
            </el-form-item>
            <el-form-item
              :label="`侧栏位置(${contentIsReverse ? '左侧' : '右侧'})`"
              class="item aside-switch"
              v-if="!docMenuIsFixedLazy"
            >
              <el-switch
                v-model="contentIsReverse"
                inline-prompt
                :active-icon="aside"
                :inactive-icon="unaside"
                size="small"
                class="settingSwitch"
              />
            </el-form-item>
          </template>
        </el-form>
      </template>
    </my-popover>
  </a>
</template>

<script setup lang="ts" name="Setting">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入图标
import dark from "@/components/icon/switch/dark.vue"
import light from "@/components/icon/switch/light.vue"
import fixed from "@/components/icon/switch/fixed.vue"
import unfixed from "@/components/icon/switch/unfixed.vue"
import click from "@/components/icon/switch/click.vue"
import unclick from "@/components/icon/switch/unclick.vue"
import move from "@/components/icon/switch/move.vue"
import unmove from "@/components/icon/switch/unmove.vue"
import aside from "@/components/icon/switch/aside.vue"
import unaside from "@/components/icon/switch/unaside.vue"
// 初始化仓库中用到的值
const {
  isDark,
  themes,
  bannerIsFixed,
  clickEffect,
  moveEffect,
  isAside,
  contentIsReverse,
  docMenuIsFixedLazy,
  asideCounts,
} = storeToRefs(useSettingStore())
// 定义与接收props
withDefaults(
  defineProps<{
    top?: string
    right?: string
    left?: string
    width?: string
    height?: string
    bg?: string
    label?: string
    triangle?: { show?: string; left?: string; right?: string }
  }>(),
  {
    label: "设置",
    height: "unset",
    width: "180px",
  }
)
</script>

<style scoped lang="scss">
// 顶部的导航项
a {
  display: flex;
  justify-content: center;
  align-items: center;
  > i {
    margin-right: 3px;
  }
}
// popover中的下边距
.el-form-item {
  margin-bottom: 0;
}
// 设置的容器
.header-setting {
  .item {
    --el-text-color-regular: var(--header-setting-label-color);
    // 改变label鼠标样式
    ::v-deep(.el-form-item__label) {
      cursor: pointer;
      justify-content: flex-start;
    }
    .settingSwitch {
      --el-switch-on-color: var(--primary-switch-on);
      --el-switch-off-color: var(--primary-switch-off);
    }
  }
  .aside-switch {
    @include media(mi) {
      display: none;
    }
  }
}
</style>
