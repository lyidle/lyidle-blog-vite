<template>
  <!-- 首页 -->
  <li>
    <router-link to="/home">
      <i class="i-ep:home-filled w-1em h-1em"> </i>
      首页
    </router-link>
  </li>
  <slot name="second"></slot>
  <!-- 个人项 -->
  <li class="custom-menu-trigger">
    <a>
      <i class="i-iconoir:page-star w-1em h-1em"></i>
      个人
    </a>
    <my-menu
      :data="[
        {
          id: 1,
          name: '关于',
          icon: 'i-akar-icons:paper-airplane',
          to: '/person/about',
        },
        {
          id: 2,
          name: '登录',
          icon: 'i-material-symbols:login',
          to: '/login',
        },
      ]"
      :triangle="true"
      :menuStyle
      top="30px"
      left="-15px"
    >
      <template #body="{ item: sub }: { item: MenuListDatum }">
        <router-link
          :to="sub.to"
          class="topnav-menu-item"
          :style="{
            width: '70px',
          }"
        >
          <i :class="sub.icon"></i> <span>{{ sub.name }}</span>
        </router-link>
      </template>
    </my-menu>
  </li>
  <!-- 设置项 -->
  <li>
    <layout-setting right="-40px" top="50px" :triangle="{ right: '50px' }">
    </layout-setting>
  </li>
  <slot name="last"></slot>
</template>

<script setup lang="ts" name="NormalTopnav">
// 引入类型
import type { Datum as MenuListDatum } from "@/api/admin/types/getMenuList"
import { menuStyleType } from "@/components/my-menu/types"
// 接收props
defineProps<{ menuStyle?: menuStyleType }>()
</script>

<style scoped></style>
