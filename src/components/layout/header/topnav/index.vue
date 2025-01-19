<template>
  <ul class="topnav">
    <layout-header-normal :menuStyle>
      <template #second>
        <layout-header-topnav-generate
          :menuStyle
          :menuList="menuList"
        ></layout-header-topnav-generate>
      </template>
    </layout-header-normal>
  </ul>
</template>

<script setup lang="ts">
// 引入类型
import type { Datum as MenuListDatum } from "@/api/admin/types/getMenuList"
import { menuStyleType } from "@/components/my-menu/types"

// 接收props
defineProps<{ menuList?: MenuListDatum[]; menuStyle?: menuStyleType }>()
</script>

<style scoped lang="scss">
$menu-item-height: 40px;
$icon-mr: 3px;
$icon-pl: 15px;
$list-gap: 5px;
.topnav {
  display: flex;
  height: 100%;
  @include media(sm) {
    display: none;
  }
}
</style>
