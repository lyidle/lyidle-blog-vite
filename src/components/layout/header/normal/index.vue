<template>
  <!-- 大屏和小屏都有的部分 -->
  <!-- 首页 -->
  <li>
    <router-link to="/home">
      <i class="i-ep:home-filled w-1em h-1em"> </i>
      首页
    </router-link>
  </li>
  <slot name="scend"></slot>
  <!-- 个人项 -->
  <li class="custom-menu-trigger">
    <a>
      <i class="i-iconoir:page-star w-1em h-1em"></i>
      个人
    </a>
    <my-menu
      :data="PersonData?.data"
      :triangle="true"
      :menuStyle
      :left="PersonData?.style.left"
    >
      <template #body="{ item: sub }: { item: PersonMenuList }">
        <router-link
          :to="sub.to"
          class="topnav-menu-item"
          :style="{ width: PersonData?.style.width }"
          @click="sub.click && sub.click()"
        >
          <i :class="sub.icon.icon" :style="sub.icon.style"></i>
          <span>{{ sub.name }}</span>
        </router-link>
      </template>
    </my-menu>
  </li>
  <slot name="last-scend"></slot>
  <!-- 设置项 -->
  <li>
    <layout-setting right="-40px" top="50px" :triangle="{ right: '50px' }">
    </layout-setting>
  </li>
  <slot name="last"></slot>
</template>

<script setup lang="ts" name="TopNavNormal">
// 引入类型
import type { PersonMenuList } from "@/components/layout/header/types"
import { menuStyleType } from "@/components/my-menu/types"
// 使用 hoooks 处理 个人选项卡的显示
import { useShowPersonHeaderMenu } from "@/hooks/header/showPersonHeaderMenu"

// 个人页面
const PersonData = useShowPersonHeaderMenu()

// 接收props
defineProps<{ menuStyle?: menuStyleType }>()
</script>

<style scoped lang="scss"></style>
