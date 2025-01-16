<template>
  <div class="item">
    <h2 class="title text-center">布局信息设置</h2>
    <div class="theme-select">
      <div class="preview">
        <div class="item" v-if="asideCounts">
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
          <span class="label cur-pointer" @click="savePosition = !savePosition">
            <span>个性化面板位置({{ savePosition ? "存储" : "不存储" }})</span>
          </span>
          <my-switch
            v-model="savePosition"
            inline-prompt
            :active-icon="aside"
            :inactive-icon="unaside"
            size="small"
          />
        </div>
      </div>

      <div class="preview" v-if="isAsideDocMenu">
        <div class="item">
          <span
            class="label cur-pointer"
            @click="docMenuIsFixed = !docMenuIsFixed"
          >
            <span
              >文章页面的目录({{ docMenuIsFixed ? "固定" : "不固定" }})</span
            >
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
      <div class="preview" v-if="isAsideDocMenu && asideCounts > 1">
        <div class="item">
          <span
            class="label cur-pointer"
            @click="docMenuIsFixedLazy = !docMenuIsFixedLazy"
          >
            <el-tooltip class="box-item" effect="dark" placement="top-start">
              <template #content>
                <div class="w-25rem">
                  默认使用的是监听页面的滚动事件,判断是否固定,
                  会频繁的获取菜单和侧边栏倒数第二个元素的位置信息,
                  只有一个目录时监听的内容区域的为位置信息，
                  会引起页面的回流和重绘 相比禁用布局改变要差一些<br />
                  使用交叉传感器是监听，元素菜单倒数第二个元素,
                  它的进入和离开视口来进行判断是否固定
                </div>
              </template>
              <span
                >文章的目录是否使用交叉传感器({{
                  docMenuIsFixedLazy ? "是" : "否"
                }})</span
              >
            </el-tooltip>
          </span>

          <my-switch
            v-model="docMenuIsFixedLazy"
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
  savePosition,
  docMenuIsFixed,
  docMenuIsFixedLazy,
  // #region 侧边栏的 显示与否
  isAsideDocMenu,
  asideCounts,
  // #endregion 侧边栏的 显示与否
} = storeToRefs(useSettingStore())
</script>

<style scoped></style>
