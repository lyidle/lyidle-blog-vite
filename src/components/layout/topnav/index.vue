<template>
  <ul class="topnav">
    <li>
      <router-link to="/home">
        <i class="i-ep:home-filled w-1em h-1em"> </i>
        首页
      </router-link>
    </li>
    <template v-for="item in menuList" :key="item.id">
      <li class="custom-menu-trigger" v-if="item.id">
        <router-link
          :to="item.to || item.children?.[0]?.to || ''"
          v-if="item.to || item.children?.[0]?.to"
        >
          <i :class="item.icon" class="w-1em h-1em"></i>
          {{ item.name }}
        </router-link>
        <a v-else v-dev-tip="{ type: 'warning', msg: '当前的菜单没有跳转项~' }">
          <i :class="item.icon" class="w-1em h-1em"></i>
          {{ item.name }}
        </a>
        <my-menu
          :data="item.children"
          v-if="item.children"
          :triangle="true"
          :top="item?.layout?.top ? item?.layout?.top : '30px'"
          :left="item?.layout?.left ? item?.layout?.left : '-15px'"
          :style
        >
          <template #body="{ item }: { item: MenuListDatum }">
            <router-link
              :to="item.to"
              class="topnav-menu-item"
              :style="{
                width: item?.layout?.width ? item?.layout?.width : '70px',
              }"
            >
              <i :class="item.icon"></i> <span>{{ item.name }}</span>
            </router-link>
          </template>
        </my-menu>
      </li>
    </template>
    <li class="custom-menu-trigger">
      <a>
        <i class="i-iconoir:page-star w-1em h-1em"></i>
        个人
      </a>
      <my-menu
        :data="[
          {
            id: 1,
            name: '关于',
            icon: 'i-akar-icons:paper-airplane',
            to: '/person/about',
          },
          {
            id: 2,
            name: '登录',
            icon: 'i-material-symbols:login',
            to: '/login',
          },
        ]"
        :triangle="true"
        :style
        top="30px"
        left="-15px"
      >
        <template #body="{ item: sub }: { item: MenuListDatum }">
          <router-link
            :to="sub.to"
            class="topnav-menu-item"
            :style="{
              width: '70px',
            }"
          >
            <i :class="sub.icon"></i> <span>{{ sub.name }}</span>
          </router-link>
        </template>
      </my-menu>
    </li>
    <li class="custom-menu-trigger">
      <layout-setting right="-40px" top="50px" :triangle="{ right: '50px' }">
      </layout-setting>
    </li>
  </ul>
</template>

<script setup lang="ts">
// 引入类型
import type { Datum as MenuListDatum } from "@/api/admin/types/getMenuList"
const style = {
  bg: "var(--header-menu-bg)",
  bgHover: "var(--header-menu-bg-hover)",
  color: "var(--header-menu-color)",
  colorHover: "var(--header-menu-color-hover)",
}
// 接收props
defineProps<{ menuList?: MenuListDatum[] }>()
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
  // 导航项目
  > li {
    margin-left: var(--header-topnav-margin);
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    > a {
      @include flex(space-between);
      position: relative;
      width: 100%;
      height: 100%;
      > i {
        margin-right: $icon-mr;
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
      bottom: 5px;
      transition: 0.3s;
    }
    &:hover:before {
      width: 100%;
    }
    // 菜单
    &:hover .custom-menu-trigger {
      opacity: 1;
    }
  }
  .topnav-menu-item {
    height: 25px;
    @include flex(start);
    padding-left: $icon-pl;
    gap: $list-gap;
  }
}
</style>
