<template>
  <li class="custom-menu-trigger" :style="{ '--pl': data?.style?.pl }">
    <slot v-if="$slots.default"></slot>
    <template v-else>
      <a>
        <i class="w-1em h-1em" :class="icon" v-if="showTitleIcon"></i>
        {{ name }}
      </a>
    </template>
    <my-menu
      :data="data?.data"
      :triangle="triangle"
      :left="data?.style?.left"
      :top
    >
      <slot name="menu-default"></slot>
      <template #custom="{ item: sub }: { item: menuItemType }">
        <slot name="custom" v-if="$slots.custom" :item="sub"></slot>
        <template v-else>
          <my-menu-item v-if="!sub.hide">
            <my-anchor
              :to="sub.to"
              class="topnav-menu-item"
              :style="{ width: data?.style?.width }"
              @click="sub?.click?.()"
            >
              <i :class="sub?.icon?.icon" :style="sub?.icon?.style"></i>
              <span>{{ sub.name }}</span>
            </my-anchor>
          </my-menu-item>
        </template>
      </template>
    </my-menu>
  </li>
</template>

<script setup lang="ts" name="Header_item">
// 引入类型
import type { menuItemType, menuView } from "@/components/layout/header/types"

const data = defineModel<menuView>("data")
withDefaults(
  defineProps<{
    top?: string
    name?: string
    icon?: string
    triangle?: boolean
    showTitleIcon?: boolean
  }>(),
  {
    triangle: true,
    showTitleIcon: true,
  }
)
</script>

<style lang="scss">
.custom-menu-trigger {
  .topnav-menu-item {
    padding-left: var(--pl);
  }
}
</style>
