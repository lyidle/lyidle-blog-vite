<template>
  <!-- 大屏和小屏都有的部分 -->
  <!-- 首页 -->
  <li>
    <router-link to="/home">
      <i class="i-ep:home-filled w-1em h-1em"> </i>
      首页
    </router-link>
  </li>
  <!-- 消息 -->
  <global-header-item v-if="userId">
    <my-anchor to="/user/msg?to=whisper">
      <i class="i-formkit:email w-1em h-1em"></i>
      消息
    </my-anchor>
    <template #menu-default>
      <my-menu-item>
        <my-anchor to="/user/msg?to=reply" class="w-100px text-center">
          <span>回复我的</span>
        </my-anchor>
      </my-menu-item>
      <my-menu-item>
        <my-anchor to="/user/msg?to=at" class="w-100px text-center">
          <span>@我的</span>
        </my-anchor>
      </my-menu-item>
      <my-menu-item>
        <my-anchor to="/user/msg?to=like" class="w-100px text-center">
          <span>收到的赞</span>
        </my-anchor>
      </my-menu-item>
      <my-menu-item>
        <my-anchor to="/user/msg?to=system" class="w-100px text-center">
          <span>我的消息</span>
        </my-anchor>
      </my-menu-item>
    </template>
  </global-header-item>
  <!-- 笔记 -->
  <layout-header-notes></layout-header-notes>
  <slot name="scend"></slot>
  <!-- 个人项 -->
  <global-header-item
    v-model:data="PersonData"
    icon="i-iconoir:page-star"
    name="个人"
  >
  </global-header-item>
  <slot name="last-scend"></slot>
  <!-- 设置项 -->
  <li>
    <global-setting
      right="-10px"
      top="50px"
      :triangle="{ right: '20px', left: 'unset' }"
    >
    </global-setting>
  </li>
  <slot name="last"></slot>
</template>

<script setup lang="ts" name="TopNavNormal">
// 使用 hoooks 处理 个人选项卡的显示
import { useShowPersonHeaderMenu } from "@/hooks/header/showPersonHeaderMenu"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 个人页面
const PersonData = useShowPersonHeaderMenu()

// 提取数据
const { userId } = storeToRefs(useUserStore())
</script>

<style scoped lang="scss"></style>
