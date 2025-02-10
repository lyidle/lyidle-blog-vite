<template>
  <li class="custom-menu-trigger">
    <slot v-if="$slots.default"></slot>
    <template v-else>
      <a>
        <i class="i-iconoir:page-star w-1em h-1em"></i>
        个人
      </a>
    </template>
    <my-menu :data="data?.data" :triangle="true" :left="data?.style.left">
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

defineProps<{ data: ReturnType }>()
</script>

<style scoped lang="scss"></style>
