<template>
  <div class="item">
    <h2 class="title text-center">布局显示与隐藏设置</h2>
    <div class="theme-select">
      <div class="preview">
        <template v-if="asideCounts">
          <div class="item">
            <span class="label cur-pointer" @click="isAside = !isAside">
              <span>{{ isAside ? "打开" : "关闭" }}侧边信息</span>
            </span>
            <my-switch
              v-model="isAside"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
        </template>
        <div class="item">
          <span class="label cur-pointer" @click="isAsideSelf = !isAsideSelf">
            <span>{{ isAsideSelf ? "打开" : "关闭" }}个人信息</span>
          </span>
          <my-switch
            v-model="isAsideSelf"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
        <div class="item">
          <span
            class="label cur-pointer"
            @click="isAsideAnnounce = !isAsideAnnounce"
          >
            <span>{{ isAsideAnnounce ? "打开" : "关闭" }}公告信息</span>
          </span>
          <my-switch
            v-model="isAsideAnnounce"
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
            @click="isAsideWebInfo = !isAsideWebInfo"
          >
            <span>{{ isAsideWebInfo ? "打开" : "关闭" }}小站咨询</span>
          </span>
          <my-switch
            v-model="isAsideWebInfo"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
        <div class="item">
          <span
            class="label cur-pointer"
            @click="isAsideRecentPage = !isAsideRecentPage"
          >
            <span>{{ isAsideRecentPage ? "打开" : "关闭" }}最新文章信息</span>
          </span>
          <my-switch
            v-model="isAsideRecentPage"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
        <div class="item">
          <span
            class="label cur-pointer"
            @click="isAsideDocMenu = !isAsideDocMenu"
          >
            <span>{{ isAsideDocMenu ? "打开" : "关闭" }}目录</span>
          </span>
          <my-switch
            v-model="isAsideDocMenu"
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

<script setup lang="ts" name="LayoutDisplay">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入图标
import aside from "@/components/icon/switch/aside.vue"
import unaside from "@/components/icon/switch/unaside.vue"
// 提取需要的变量 全局设置
const {
  isAside,
  // #region 侧边栏的 显示与否
  isAsideSelf,
  isAsideAnnounce,
  isAsideWebInfo,
  isAsideRecentPage,
  isAsideDocMenu,
  asideCounts,
  // #endregion 侧边栏的 显示与否
} = storeToRefs(useSettingStore())
</script>

<style scoped></style>
