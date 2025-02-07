<template>
  <ul class="menu-list" ref="menus">
    <template v-for="item in MenuList" :key="item.name">
      <li>
        <div class="menu-item">
          <div class="start-icon">
            <parse-icon :icon="item.icon"></parse-icon>
            <router-link v-if="item.to" :to="item.to">{{
              item.name
            }}</router-link>
            <a v-else>{{ item.name }}</a>
          </div>
          <div
            v-if="item.children?.length"
            class="toggle"
            @click="toggle($event, item.id)"
          >
            <i :class="icon.plus"></i>
          </div>
        </div>
        <ul v-if="item.children?.length" class="submenu">
          <!-- 递归调用 修改 props中的 MenuList 为 children-->
          <RecursiveMenuList v-bind="{ ...props, MenuList: item.children }" />
        </ul>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts" name="RecursiveMenuList">
// 引入类型
import { GetMenuList } from "@/api/admin/types/getMenuList"

// 接收 props
const props = defineProps<{
  MenuList: GetMenuList["data"]
}>()

const icon = { plus: "i-ic:baseline-plus", minus: "i-ic:baseline-minus" }

// map值的类型
type MapType = {
  height: number
  open: boolean
  toggle: Element
  submenu: HTMLUListElement
}

// 打开的 菜单集合
const openMenus = new Map<HTMLDivElement, MapType>()

// 往上递归 的 submenu 设置为 auto
const parentSubMenuCallback = (el: Element): void => {
  if (el.classList.contains("submenu")) {
    const tar = el as HTMLUListElement
    tar.style.height = "auto"
  }
  // 到达 当前组件没有父级时停止
  if (el.classList.contains("mini-nav-avater-container")) return
  const parent = el.parentElement
  parent && parentSubMenuCallback(parent) // **确保返回值**
}

// 切换按钮
const toggle = (e: MouseEvent, id: number) => {
  // 点击的目标 的父级
  const parent = (e.target as HTMLLIElement).parentElement as HTMLDivElement
  if (!parent) return
  const cache = openMenus.get(parent)
  if (cache) {
    // 打开的情况
    if (cache.open) {
      // 关闭
      const defaultValue = { ...cache, open: false }
      // 往上递归 得到 parentSubMenu
      parentSubMenuCallback(parent)
      // 恢复 高度
      cache.submenu.style.height = `${cache.height}px`
      // 引起回流
      parent.getBoundingClientRect()
      cache.toggle.classList.add(icon.plus || "")
      cache.toggle.classList.remove(icon.minus || "")
      cache.submenu.style.height = "0"
      openMenus.set(parent, defaultValue)
      return
    }
    // 关闭的情况
    // 展开
    const defaultValue = { ...cache, open: true }

    // 往上递归 得到 parentSubMenu
    parentSubMenuCallback(parent)
    cache.toggle.classList.add(icon.minus || "")
    cache.toggle.classList.remove(icon.plus || "")
    cache.submenu.style.height = `${cache.height}px`
    openMenus.set(parent, defaultValue)
    return
  }
  // 得到所有 ul的 集合
  const ulCollactions = document.querySelectorAll<HTMLUListElement>("ul")
  if (!ulCollactions) return
  // 得到 按钮
  const toggle = parent.querySelector(".toggle i")
  if (!toggle) return
  // 得到 子集
  const submenu = parent.nextElementSibling as HTMLUListElement
  // 没有子集退出
  if (!submenu) return

  // 设置默认值
  submenu.style.height = "auto"
  const defaultValue = {
    height: submenu?.scrollHeight,
    open: true,
    toggle,
    submenu,
  } as MapType

  submenu.style.height = "0"
  // 强制回流
  submenu.getBoundingClientRect()
  // 展开
  // 往上递归 得到 parentSubMenu
  parentSubMenuCallback(parent)
  // 设置高度
  submenu.style.height = `${defaultValue.height}px`
  toggle.classList.add(icon.minus || "")
  toggle.classList.remove(icon.plus || "")
  openMenus.set(parent, defaultValue)
}

// 卸载
onBeforeUnmount(() => {
  openMenus.clear()
})
</script>

<style scoped lang="scss">
$item-bg: var(--header-mini-title-bg);
$item-bg-hover: var(--header-mini-title-bg-hover);
$item-color: var(--header-mini-title-color);
$item-color-hover: var(--header-mini-title-color-hover);
$sub-bg: var(--header-mini-subtitle-bg);
$sub-bg-hover: var(--header-mini-subtitle-bg-hover);
$sub-color: var(--header-mini-subtitle-color);
$sub-color-hover: var(--header-mini-subtitle-color-hover);
$menu-item-h: 35px;
$gap: 5px;
$item-bg: transparent;
// 组件容器
.menu-list {
  list-style: none;
  // 每一项
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    height: $menu-item-h;
    padding-left: 20px;
    background-color: $item-bg;
    color: $item-color;
    // 悬浮
    &:hover {
      background: $item-bg-hover;
      color: $item-color-hover;
    }
    // 开始的 图标集合
    .start-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $gap;
      margin-left: $gap * 2;
    }
    // 切换按钮
    .toggle {
      height: $menu-item-h;
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        width: 1rem;
        height: 1rem;
        pointer-events: none;
      }
    }
  }
  // 子集
  .submenu {
    .menu-item {
      background-color: $sub-bg;
      color: $sub-color;
      // 悬浮
      &:hover {
        background: $sub-bg-hover;
        color: $sub-color-hover;
      }
    }
    height: 0;
    overflow: hidden;
    transition: height var(--primary-during);
  }
}
</style>
