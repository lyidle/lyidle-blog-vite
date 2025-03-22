<template>
  <li class="custom-menu-trigger" :style="{ '--pl': data?.style?.pl }">
    <slot v-if="$slots.default"></slot>
    <template v-else>
      <a>
        <i class="w-1em h-1em" :class="icon"></i>
        {{ name }}
      </a>
    </template>
    <my-menu :data="data?.data" :triangle="true" :left="data?.style?.left" :top>
      <template #body="{ item: sub }: { item: menuItemType }">
        <my-anchor
          :to="sub.to"
          class="topnav-menu-item"
          :style="{ width: data?.style?.width }"
          @click="sub.click && sub.click()"
          v-if="!sub?.hide"
        >
          <i :class="sub?.icon?.icon" :style="sub?.icon?.style"></i>
          <span>{{ sub.name }}</span>
        </my-anchor>
      </template>
    </my-menu>
  </li>
</template>

<script setup lang="ts" name="Header_item">
// 引入类型
import type { menuItemType, menuView } from "@/components/layout/header/types"

const data = defineModel<menuView>("data")

defineProps<{ top?: string; name?: string; icon?: string }>()
</script>

<style scoped lang="scss">
.topnav-menu-item {
  padding-left: var(--pl);
}
</style>
