<template>
  <template v-for="item in userMenuList" :key="item.id">
    <li class="custom-menu-trigger" v-if="item.id">
      <!-- 标题有 to 的 则 重定向 -->
      <router-link :to="item.to || ''" v-if="item.to">
        <i :class="item.icon" class="w-1em h-1em"></i>
        {{ item.name }}
      </router-link>
      <!-- 没有的 -->
      <a v-else>
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
          <!-- 有 to 的 则 router-link -->
          <router-link
            :to="item.to"
            v-if="item.to"
            class="topnav-menu-item"
            :style="{
              width: item?.layout?.width ? item?.layout?.width : '70px',
            }"
          >
            <i :class="item.icon"></i> <span>{{ item.name }}</span>
          </router-link>
          <!-- 没有的 -->
          <a
            v-else
            class="topnav-menu-item"
            :style="{
              width: item?.layout?.width ? item?.layout?.width : '70px',
            }"
          >
            <i :class="item.icon"></i> <span>{{ item.name }}</span>
          </a>
        </template>
      </my-menu>
    </li>
  </template>
</template>

<script setup lang="ts" name="TopNavMenuList">
// 引入类型
import type { Datum as MenuListDatum } from "@/api/admin/types/getMenuList"
import { menuStyleType } from "@/components/my-menu/types"
// 引入store
import { useUserStore } from "@/store/user"

const { userMenuList } = storeToRefs(useUserStore())

// 接收props
defineProps<{ menuStyle?: menuStyleType }>()
</script>

<style scoped></style>
