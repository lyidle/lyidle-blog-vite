<template>
  <!-- header中间的部分 -->
  <template v-for="item in userMenuList" :key="item.id">
    <li class="custom-menu-trigger" v-if="item.id">
      <!-- 有 to 的 则 router-link -->
      <router-link :to="item.to" v-if="item.to">
        <parse-icon :icon="item.icon"></parse-icon>
        {{ item.name }}
      </router-link>
      <!-- 没有的 -->
      <a v-else>
        <parse-icon :icon="item.icon"></parse-icon>
        {{ item.name }}
      </a>
      <my-menu
        :data="item.children"
        v-if="item.children?.length"
        :triangle="true"
        :top="item?.layout?.top ? item?.layout?.top : '30px'"
        :left="item?.layout?.left ? item?.layout?.left : '-15px'"
        :menuStyle
      >
        <template #body="{ item: subtitle }: { item: MenuListDatum }">
          <!-- 有 to 的 则 router-link -->
          <router-link
            :to="subtitle.to"
            v-if="subtitle.to"
            class="topnav-menu-item"
            :style="{
              width: subtitle?.layout?.width ? subtitle?.layout?.width : '70px',
            }"
          >
            <parse-icon :icon="subtitle.icon"></parse-icon>
            <span>{{ subtitle.name }}</span>
          </router-link>
          <!-- 没有的 -->
          <a
            v-else
            class="topnav-menu-item"
            :style="{
              width: subtitle?.layout?.width ? subtitle?.layout?.width : '70px',
            }"
          >
            <parse-icon :icon="subtitle.icon"></parse-icon>
            <i :class="subtitle.icon"></i> <span>{{ subtitle.name }}</span>
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

<style scoped lang="scss"></style>
