<template>
  <div class="item">
    <h2 class="title text-center">布局信息设置</h2>
    <div class="theme-select">
      <div class="preview">
        <div class="item">
          <span
            class="label cur-pointer"
            @click="contentIsReverse = !contentIsReverse"
          >
            <span>侧边信息({{ contentIsReverse ? "左侧" : "右侧" }})</span>
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
              >面板位置({{ isPanelPositionSaved ? "存储" : "不存储" }})</span
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
            <span>文章目录({{ docMenuIsFixed ? "固定" : "不固定" }})</span>
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
            <span>滚动挂饰({{ isScrollOrnaments ? "开启" : "关闭" }})</span>
          </span>
          <my-switch
            v-model="isScrollOrnaments"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
        <div class="item">
          <span class="label cur-pointer" @click="isSaveScene = !isSaveScene">
            <span>面板记录({{ isSaveScene ? "开启" : "关闭" }})</span>
          </span>
          <my-switch
            v-model="isSaveScene"
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
  isSaveScene,
} = storeToRefs(useSettingStore())
</script>

<style scoped></style>
