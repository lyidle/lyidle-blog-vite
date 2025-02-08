<template>
  <ul class="topnav">
    <layout-header-normal :menuStyle>
      <template #scend>
        <!-- 笔记 -->
        <layout-header-notes :menuStyle></layout-header-notes>
        <!-- <my-menu-instance
          v-for="item in userMenuList"
          :data="[item]"
          :name="item.name"
          :menuStyle
        ></my-menu-instance> -->
      </template>
      <template #last>
        <my-menu-instance
          v-for="item in userMenuList"
          :data="[item]"
          :name="item.name"
          :menuStyle
        ></my-menu-instance>
      </template>
    </layout-header-normal>
  </ul>
</template>

<script setup lang="ts" name="TopNav">
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"
// 引入store
import { useUserStore } from "@/store/user"

const { userMenuList } = storeToRefs(useUserStore())
userMenuList.value?.push(userMenuList.value?.[0])
userMenuList.value?.push(userMenuList.value?.[0])
userMenuList.value?.push(userMenuList.value?.[0])

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
