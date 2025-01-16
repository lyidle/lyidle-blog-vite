<template>
  <my-dialog
    v-model="isShowPanel"
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
    titleHeight="var(--theme-panel-title-height)"
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
            @click="setScene = index"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="content">
          <layout-theme-global v-if="setScene == 0"></layout-theme-global>
          <div v-if="setScene == 1"><div>test1</div></div>
          <div v-if="setScene == 2"><div>test2</div></div>
          <div v-if="setScene == 3"><div>test3</div></div>
          <div v-if="setScene == 4"><div>test4</div></div>
          <div v-if="setScene == 5"><div>test5</div></div>
          <div v-if="setScene == 6"><div>test6</div></div>
          <div v-if="setScene == 7"><div>test7</div></div>
          <div v-if="setScene == 8"><div>test8</div></div>
          <div v-if="setScene == 9"><div>test9</div></div>
        </div>
      </div>
    </template>
  </my-dialog>
</template>

<script setup lang="ts" name="LayoutSetting">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 初始化仓库中用到的值
const { setScene, isShowPanel, savePosition, initLeft, initTop } = storeToRefs(
  useSettingStore()
)
// 侧边栏数据
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
$gap: var(--theme-panel-content-gap);
$side-p-t: 0;
$side-pd: 10px 0;
$content-btn-gap: 10px;
$title-height: var(--theme-panel-title-height);
.container {
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
    ::v-deep(> [class$="-container"]) {
      width: 100%;
      height: 100%;
      padding: $gap;
      overflow: auto;
    }
  }
}
</style>
