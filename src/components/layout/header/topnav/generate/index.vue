<template>
  <template v-for="item in menuList" :key="item.id">
    <li class="custom-menu-trigger" v-if="item.id">
      <router-link
        :to="item.to || item.children?.[0]?.to || ''"
        v-if="item.to || item.children?.[0]?.to"
      >
        <i :class="item.icon" class="w-1em h-1em"></i>
        {{ item.name }}
      </router-link>
      <a v-else v-dev-tip="{ type: 'warning', msg: '当前的菜单没有跳转项~' }">
        <i :class="item.icon" class="w-1em h-1em"></i>
        {{ item.name }}
      </a>
      <my-menu
        :data="item.children"
        v-if="item.children"
        :triangle="true"
        :top="item?.layout?.top ? item?.layout?.top : '30px'"
        :left="item?.layout?.left ? item?.layout?.left : '-15px'"
        :menuStyle
      >
        <template #body="{ item }: { item: MenuListDatum }">
          <router-link
            :to="item.to"
            class="topnav-menu-item"
            :style="{
              width: item?.layout?.width ? item?.layout?.width : '70px',
            }"
          >
            <i :class="item.icon"></i> <span>{{ item.name }}</span>
          </router-link>
        </template>
      </my-menu>
    </li>
  </template>
</template>

<script setup lang="ts" name="TopnavGenerate">
// 引入类型
import type { Datum as MenuListDatum } from "@/api/admin/types/getMenuList"
import { menuStyleType } from "@/components/my-menu/types"
// 接收props
defineProps<{ menuList?: MenuListDatum[]; menuStyle?: menuStyleType }>()
</script>

<style scoped></style>
