<template>
  <ul class="topnav">
    <layout-header-normal :menuStyle>
      <template #scend>
        <layout-header-topnav-generate
          :menuStyle
        ></layout-header-topnav-generate>
      </template>
    </layout-header-normal>
  </ul>
</template>

<script setup lang="ts" name="TopNav">
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"

// 接收props
defineProps<{ menuStyle?: menuStyleType }>()
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
