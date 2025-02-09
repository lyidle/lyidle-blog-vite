<template>
  <li class="custom-menu-trigger">
    <a>
      <i class="i-iconoir:page-star w-1em h-1em"></i>
      个人
    </a>
    <my-menu
      :data="data?.data"
      :triangle="true"
      :menuStyle
      :left="data?.style.left"
    >
      <template #body="{ item: sub }: { item: PersonMenuList }">
        <router-link
          :to="sub.to"
          class="topnav-menu-item"
          :style="{ width: data?.style.width }"
          @click="sub.click && sub.click()"
        >
          <i :class="sub.icon.icon" :style="sub.icon.style"></i>
          <span>{{ sub.name }}</span>
        </router-link>
      </template>
    </my-menu>
  </li>
</template>

<script setup lang="ts" name="Header_item">
// 引入类型
import type { PersonMenuList } from "@/components/layout/header/types"
import { ReturnType } from "@/hooks/header/showPersonHeaderMenu"
// 引入类型
import { menuStyleType } from "@/components/my/menu/types"

defineProps<{ data: ReturnType; menuStyle: menuStyleType }>()
</script>

<style scoped></style>
