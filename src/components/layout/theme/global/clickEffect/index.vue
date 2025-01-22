<template>
  <div class="item">
    <h2 class="title text-center">点击特效设置</h2>
    <div class="theme-select">
      <div class="preview">
        <div class="item">
          <span class="label cur-pointer" @click="clickEffect = !clickEffect">
            <span>预览：</span>
            <span>点击特效({{ clickEffect ? "开启" : "关闭" }})</span>
          </span>
          <my-switch
            v-model="clickEffect"
            inline-prompt
            :active-icon="click"
            :inactive-icon="unclick"
            size="small"
          />
        </div>
      </div>
      <div class="contain">
        <div class="item">
          <span class="label">点击特效选择</span>
          <my-select v-model="clicks" :options="clickOptions"></my-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ClickEffect">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入图标
import click from "@/components/icon/switch/click.vue"
import unclick from "@/components/icon/switch/unclick.vue"
// 提取需要的变量 全局设置
const { clickEffect, clicks } = storeToRefs(useSettingStore())
const { clickOptions } = useSettingStore()
</script>
