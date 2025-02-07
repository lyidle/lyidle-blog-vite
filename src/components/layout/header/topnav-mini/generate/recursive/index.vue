<template>
  <ul class="menu-list" ref="menus">
    <template v-for="item in MenuList" :key="item.id">
      <li>
        <div class="menu-item" @click="toggle($event, item.id)">
          <parse-icon :icon="item.icon"></parse-icon>
          <router-link v-if="item.to" :to="item.to">{{
            item.name
          }}</router-link>
          <span v-else>{{ item.name }}</span>
          <i
            v-if="item.children?.length"
            class="toggle i-ic:baseline-minus"
          ></i>
          <!--     :class="
              isOpen(item.id) ? 'i-ic:baseline-minus' : 'i-ic:baseline-plus'
            " -->
        </div>
        <ul v-if="item.children?.length" class="submenu">
          <RecursiveMenuList :MenuList="item.children" />
        </ul>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts" name="RecursiveMenuList">
// 引入类型
import { GetMenuList } from "@/api/admin/types/getMenuList"

// 接收 props
defineProps<{ MenuList: GetMenuList["data"] }>()
// 打开的 菜单集合
const openMenus = new Map<HTMLUListElement, number>()

// 切换按钮
const toggle = (e: MouseEvent, id: number) => {
  const tar = e.target as HTMLLIElement
  const submenu = tar.parentElement?.nextElementSibling
  console.log({ tar, submenu })
}

// 卸载
onBeforeUnmount(() => {
  openMenus.clear()
})
</script>

<style scoped lang="scss">
.menu-list {
  list-style: none;
  padding-left: 0;
}
.menu-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 5px;
  transition: background 0.3s;
  &:hover {
    background: #f0f0f0;
  }
}
.toggle {
  margin-left: auto;
  transition: transform 0.3s;
  &.i-ic\:baseline-minus {
    transform: rotate(0deg);
  }
  &.i-ic\:baseline-plus {
    transform: rotate(0deg);
  }
}
.submenu {
  padding-left: 16px;
}
</style>
