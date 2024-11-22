<template>
  <ul class="topnav">
    <template v-for="item in menuList" :key="item.id">
      <li>
        <router-link :to="item.to" v-if="item.to">
          <i :class="item.icon" class="w-1em h-1em"></i>
          {{ item.title }}
        </router-link>
        <a v-else>
          <i :class="item.icon" class="w-1em h-1em"></i>
          {{ item.title }}
        </a>
        <my-menu
          :data="item.children"
          v-if="item.children"
          :triangle="true"
          :width="item?.layout?.width ? item?.layout?.width : '70px'"
          :top="item?.layout?.top ? item?.layout?.top : '20px'"
          :left="item?.layout?.left ? item?.layout?.left : '-15px'"
          :gap="item?.layout?.gap ? item?.layout?.gap : '15px'"
          :style
        ></my-menu>
      </li>
    </template>
    <li>
      <layout-setting
        width="150px"
        left="-60px"
        top="40px"
        :triangle="{ right: '50px' }"
      >
      </layout-setting>
    </li>
  </ul>
</template>

<script setup lang="ts">
// 引入类型
import { menuListType } from "@/api/user/type"
const style = {
  bg: "var(--header-menu-bg)",
  bgHover: "var(--header-menu-bg-hover)",
  color: "var(--header-menu-color)",
  colorHover: "var(--header-menu-color-hover)",
}
// 接收props
defineProps<{ menuList: menuListType[] }>()
</script>

<style scoped lang="scss">
.topnav {
  @media screen and (max-width: $scr-sm) {
    display: none;
  }
  display: flex;
  > li {
    margin-left: var(--header-topnav-margin);
    position: relative;
    > a {
      @include flex(space-between);
      position: relative;
      > i {
        margin-right: 3px;
      }
    }
    // 导航下划线
    &::before {
      content: "";
      display: block;
      width: 0;
      height: var(--header-topnav-mask-height);
      background-color: var(--header-topnav-mask-color);
      position: absolute;
      bottom: -5px;
      transition: 0.3s;
    }
    &:hover:before {
      width: 100%;
    }
    // 菜单
    &:hover .custom-menu {
      opacity: 1;
    }
  }
}
</style>
