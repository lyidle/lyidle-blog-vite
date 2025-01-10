<template>
  <my-dialog
    v-model="iShowSet"
    v-model:top="initTop"
    v-model:left="initLeft"
    v-model:isSave="savePosition"
    closeDur="var(--primary-during)"
    closeColor="var(--theme-setting-close-color)"
    closeColorHover="var(--theme-setting-close-color-hover)"
    mask="var(--theme-setting-mask)"
    bg="var(--theme-setting-bg)"
    titleBg="var(--theme-setting-title-bg)"
    color="var(--primary-color)"
    titleColor="var(--theme-setting-title-color)"
  >
    <template #title>个性化设置</template>
    <template #content>
      <div class="container">
        <ul class="side">
          <li
            class="cur-pointer"
            :class="{ active: setScene == index }"
            v-for="(item, index) in asideData"
            :key="item.name"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="content">
          <div v-if="setScene == 0">
            <el-form label-width="130px" class="m-5px m-l-15px header-setting">
              <el-form-item
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
              <el-form-item
                :label="isAside ? '关闭侧边信息' : '打开侧边信息'"
                class="item aside-switch"
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
            </el-form>
          </div>
          <div v-if="setScene == 1">12313</div>
        </div>
      </div>
    </template>
  </my-dialog>
</template>

<script setup lang="ts" name="LayoutSetting">
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
const { setScene, iShowSet, savePosition, initLeft, initTop } = storeToRefs(
  useSettingStore()
)
// 提取需要的变量 全局设置
const { isDark, bannerIsFixed, clickEffect, moveEffect, isAside } = storeToRefs(
  useSettingStore()
)
const asideData = [
  {
    name: "全局设置",
  },
  {
    name: "test1",
  },
  {
    name: "test2",
  },
  {
    name: "test3",
  },
  {
    name: "test4",
  },
  {
    name: "test5",
  },
  {
    name: "test6",
  },
  {
    name: "test7",
  },
  {
    name: "test8",
  },
  {
    name: "test9",
  },
]
</script>

<style scoped lang="scss">
$gap: 10px;
$side-p-t: 10px;
$side-pd: 10px 0;
.container {
  display: flex;
  justify-content: space-between;
  .side {
    width: 100px;
    background-color: var(--theme-setting-side-bg);
    padding-top: $side-p-t;
    color: var(--theme-setting-aside-color);
    & > li {
      background-color: var(--theme-setting-side-bg-item);
      text-align: center;
      padding: $side-pd;
      &.active {
        background-color: var(--theme-setting-side-bg-active);
        color: var(--theme-setting-side-color-active);
      }
      &:hover {
        background-color: var(--theme-setting-side-bg-item-hover);
        color: var(--theme-setting-side-color-hover);
      }
    }
  }
  .content {
    width: 100%;
    padding: $gap 0 0 $gap;
    // 设置的容器
    .header-setting {
      .settingSwitch {
        --el-switch-on-color: var(--primary-switch-on);
        --el-switch-off-color: var(--primary-switch-off);
      }
      .aside-switch {
        @include media(mi) {
          display: none;
        }
      }
    }
  }
}
</style>
