<template>
  <my-dialog
    v-model="isShowPanel"
    v-model:top="savedPanelTop"
    v-model:left="savedPanelLeft"
    v-model:isSave="isPanelPositionSaved"
    closeDur="var(--primary-during)"
    closeColor="var(--theme-setting-close-color)"
    closeColorHover="var(--theme-setting-close-color-hover)"
    mask="var(--theme-setting-mask)"
    bg="var(--theme-setting-bg)"
    titleBg="var(--theme-setting-title-bg)"
    color="var(--primary-color)"
    titleColor="var(--theme-setting-title-color)"
    titleHeight="var(--theme-panel-title-height)"
    class="theme-panel"
  >
    <template #title>个性化设置</template>
    <template #content>
      <div class="panel-container">
        <ul class="side">
          <template v-for="(item, index) in asideData" :key="item.name">
            <!-- 判断 索引 为用户编辑时 的 编辑选项是否显示 -->
            <li
              class="cur-pointer"
              :class="{ active: setScene == index }"
              @click="setScene = index"
              v-if="item.name === '用户编辑' ? isShowEditor : true"
            >
              {{ item.name }}
            </li>
          </template>
        </ul>
        <div class="content">
          <!-- 全局设置 -->
          <global-theme-global
            v-if="setScene === asideDataMap['全局设置']"
            class="content-container"
          ></global-theme-global>
          <!-- 用户编辑 -->
          <div
            v-if="isShowEditor && setScene === asideDataMap['用户编辑']"
            class="content-container"
          >
            <div>
              <global-theme-user-editor></global-theme-user-editor>
            </div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test2']">
            <div>test2</div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test3']">
            <div>test3</div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test4']">
            <div>test4</div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test5']">
            <div>test5</div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test6']">
            <div>test6</div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test7']">
            <div>test7</div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test8']">
            <div>test8</div>
          </div>
          <div v-if="isShowEditor && setScene === asideDataMap['test9']">
            <div>test9</div>
          </div>
        </div>
      </div>
    </template>
  </my-dialog>
</template>

<script setup lang="ts" name="LayoutSetting">
// 引入仓库
import { useSettingStore } from "@/store/setting"
import { useUserStore } from "@/store/user"
// 引入 侧边栏数据
import { asideData, asideDataMap } from "./asideData"

// 初始化仓库中用到的值
const {
  setScene,
  isShowPanel,
  isPanelPositionSaved,
  savedPanelLeft,
  savedPanelTop,
  isSaveScene,
} = storeToRefs(useSettingStore())
const { userToken } = storeToRefs(useUserStore())
const isShowEditor = ref(false)
// 监听
watchEffect(() => {
  // 打开面板时 判断
  if (isShowPanel.value) {
    if (!isSaveScene.value) {
      // 如果 不保存 场景信息 则设置为 0
      setScene.value = 0
    }
    // 判断有无 账户 取消与显示 用户编辑栏
    if (userToken.value) {
      isShowEditor.value = true
    } else {
      isShowEditor.value = false
    }
    // 没有账号的情况 且 场景保存的 1 则设置为 0
    if (!userToken.value && setScene.value === asideDataMap["用户编辑"]) {
      setScene.value = 0
      isShowEditor.value = false
    }
  }
})
</script>

<style scoped lang="scss">
$gap: var(--theme-panel-content-gap);
$side-p-t: 0;
$side-pd: 10px 0;
$content-btn-gap: 10px;
$title-height: var(--theme-panel-title-height);
.theme-panel {
  z-index: $theme-panel-index;
  > .dialog-container {
    > .panel-container {
      height: calc(100% - $title-height);
      // 内容 和 aside 左右分布
      display: flex;
      justify-content: space-between;
      // 侧边栏
      > .side {
        width: 100px;
        height: 100%;
        background-color: var(--theme-setting-side-bg);
        padding-top: $side-p-t;
        color: var(--theme-setting-aside-color);
        > li {
          background-color: var(--theme-setting-side-bg-item);
          text-align: center;
          padding: $side-pd;
          // 分割线
          &:not(:last-child) {
            border-bottom: var(--theme-setting-side-hr);
          }
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
      // 内容
      > .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        > .content-container {
          width: 100%;
          height: 100%;
          padding: $gap;
          overflow: auto;
        }
      }
    }
  }
}
</style>
