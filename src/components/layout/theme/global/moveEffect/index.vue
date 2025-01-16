<template>
  <div class="item">
    <h2 class="title text-center">移动特效设置</h2>
    <div class="theme-select">
      <div class="preview">
        <div class="item">
          <span class="label cur-pointer" @click="moveEffect = !moveEffect">
            <span>预览：</span>
            <span>移动特效</span>
          </span>
          <my-switch
            v-model="moveEffect"
            inline-prompt
            :active-icon="move"
            :inactive-icon="unmove"
            size="small"
          />
        </div>
      </div>
      <div class="contain">
        <div class="item">
          <span class="label">移动特效选择</span>
          <my-select v-model="moves" :options="moveOptions"></my-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="MoveEffect">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入图标
import move from "@/components/icon/switch/move.vue"
import unmove from "@/components/icon/switch/unmove.vue"
// 提取需要的变量 全局设置
const { moveEffect, moves } = storeToRefs(useSettingStore())
const { moveOptions } = useSettingStore()
</script>

<style scoped></style>
