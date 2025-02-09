<template>
  <!-- 大屏和小屏都有的部分 -->
  <!-- 首页 -->
  <li>
    <router-link to="/home">
      <i class="i-ep:home-filled w-1em h-1em"> </i>
      首页
    </router-link>
  </li>
  <!-- 笔记 -->
  <layout-header-notes></layout-header-notes>
  <slot name="scend"></slot>
  <!-- 个人项 -->
  <global-header-item :data="PersonData"> </global-header-item>
  <slot name="last-scend"></slot>
  <!-- 设置项 -->
  <li>
    <global-setting right="-40px" top="50px" :triangle="{ right: '50px' }">
    </global-setting>
  </li>
  <slot name="last"></slot>
</template>

<script setup lang="ts" name="TopNavNormal">
// 使用 hoooks 处理 个人选项卡的显示
import { useShowPersonHeaderMenu } from "@/hooks/header/showPersonHeaderMenu"

// 个人页面
const PersonData = useShowPersonHeaderMenu()
</script>

<style scoped lang="scss"></style>
