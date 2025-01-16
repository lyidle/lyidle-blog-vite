<template>
  <div class="item">
    <h2 class="title text-center">主题设置</h2>
    <div class="theme-select">
      <div class="preview">
        <div class="item select-theme">
          <span class="label">预览：主题模式选择</span>
          <my-select v-model="themes" :options="themeOptions"></my-select>
        </div>
        <div class="item" v-if="themes === 'switch'">
          <span
            class="label cur-pointer"
            @click="bannerIsFixed = !bannerIsFixed"
          >
            <span>{{ !isDark ? "暗夜模式" : "白天模式" }}</span>
          </span>
          <my-switch
            v-model="isDark"
            inline-prompt
            :active-icon="dark"
            :inactive-icon="light"
            size="small"
          />
        </div>
        <div class="item">
          <span
            class="label cur-pointer"
            @click="bannerIsFixed = !bannerIsFixed"
          >
            <span>{{ bannerIsFixed ? "背景固定" : "背景悬浮" }}</span>
          </span>
          <my-switch
            v-model="bannerIsFixed"
            inline-prompt
            :active-icon="fixed"
            :inactive-icon="unfixed"
            size="small"
          />
        </div>
      </div>
      <div class="contain">
        <div class="item">
          <span class="label">白天主题设置</span>
          <my-select v-model="lights" :options="lightOptions"></my-select>
        </div>
        <div class="item">
          <span class="label">暗夜主题设置</span>
          <el-select v-model="darks" placeholder="Select" size="small">
            <el-option
              v-for="item in darkOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="SetThemes">
// 引入图标
import dark from "@/components/icon/switch/dark.vue"
import light from "@/components/icon/switch/light.vue"
import fixed from "@/components/icon/switch/fixed.vue"
import unfixed from "@/components/icon/switch/unfixed.vue"
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 提取需要的变量 全局设置
const { isDark, bannerIsFixed, themes, lights, darks } = storeToRefs(
  useSettingStore()
)
const { themeOptions, lightOptions, darkOptions } = useSettingStore()
</script>
