<template>
  <div class="item">
    <h2 class="title text-center">布局信息设置</h2>
    <div class="theme-select">
      <div class="preview">
        <div class="item" v-if="!asideCounts">
          <span
            class="label cur-pointer"
            @click="contentIsReverse = !contentIsReverse"
          >
            <span>侧栏位置({{ contentIsReverse ? "左侧" : "右侧" }})</span>
          </span>
          <my-switch
            v-model="contentIsReverse"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
        <div class="item">
          <span
            class="label cur-pointer"
            @click="isPanelPositionSaved = !isPanelPositionSaved"
          >
            <span
              >个性化面板位置({{
                isPanelPositionSaved ? "存储" : "不存储"
              }})</span
            >
          </span>
          <my-switch
            v-model="isPanelPositionSaved"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>

        <div class="item">
          <span
            class="label cur-pointer"
            @click="docMenuIsFixed = !docMenuIsFixed"
          >
            <span>文章的目录({{ docMenuIsFixed ? "固定" : "不固定" }})</span>
          </span>
          <my-switch
            v-model="docMenuIsFixed"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
      </div>
      <div class="preview">
        <div class="item">
          <span
            class="label cur-pointer"
            @click="isScrollOrnaments = !isScrollOrnaments"
          >
            <span>滚动挂饰({{ isScrollOrnaments ? "开启" : "不开启" }})</span>
          </span>
          <my-switch
            v-model="isScrollOrnaments"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="LayoutSet">
// 引入图标
import aside from "@/components/icon/switch/aside.vue"
import unaside from "@/components/icon/switch/unaside.vue"
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 提取需要的变量 全局设置
const {
  contentIsReverse,
  isPanelPositionSaved,
  docMenuIsFixed,
  isScrollOrnaments,
  // #region 侧边栏的 显示与否
  asideCounts,
  // #endregion 侧边栏的 显示与否
} = storeToRefs(useSettingStore())
</script>

<style scoped></style>
