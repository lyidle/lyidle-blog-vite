<template>
  <template v-for="(item, index) in data" :key="item.name">
    <ul class="menu-list" ref="menus" v-if="item.name">
      <li>
        <div class="menu-item">
          <div class="start-icon">
            <my-anchor v-if="filterPath(item)" :to="filterPath(item)">
              <!-- 使用 的my-anchor 的默认插槽  -->
              <slot name="link" :index :item>
                <icon-parse :icon="item.icon"></icon-parse>
                <span class="truncate w-75%">{{ item.name }}</span>
              </slot>
            </my-anchor>
            <!-- 切换按钮 -->
            <div
              v-if="item.children?.length"
              class="toggle"
              @click="toggle($event)"
            >
              <i :class="icon.plus"></i>
            </div>
          </div>
        </div>
        <!-- 判断 有无子集 -->
        <ul v-if="item.children?.length" class="submenu">
          <!-- 递归调用 修改 props中的 data 为 children -->
          <AccordionRecursive v-bind="{ ...props, data: item.children }">
            <!-- 插槽传递 -->
            <template #link="{ item, index }">
              <slot name="link" :index :item> </slot>
            </template>
          </AccordionRecursive>
        </ul>
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts" name="AccordionRecursive">
// 引入类型
import { AccordionMenuItem, AccordionMenuList } from "../types"
// 引入 图标
import "../icons"

// 接收 props
const props = withDefaults(
  defineProps<{
    data: AccordionMenuList
    titleBg?: string
    titleBgHover?: string
    titleColor?: string
    titleColorHover?: string
    subBg?: string
    subBgHover?: string
    subColor?: string
    subColorHover?: string
    icon?: { plus: string; minus: string }
  }>(),
  {
    icon: () => ({ plus: "i-ic:baseline-plus", minus: "i-ic:baseline-minus" }),
    titleBg: "var(--accordion-title-bg)",
    titleBgHover: "var(--accordion-title-bg-hover)",
    titleColor: "var(--accordion-title-color)",
    titleColorHover: "var(--accordion-title-color-hover)",
    subBg: "var(--accordion-subtitle-bg)",
    subBgHover: "var(--accordion-subtitle-bg-hover)",
    subColor: "var(--accordion-subtitle-color)",
    subColorHover: "var(--accordion-subtitle-color-hover)",
  }
)

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
const toggle = (e: MouseEvent) => {
  // 点击的 项目 的父级 menu-item
  const parent = (e.target as HTMLLIElement)?.parentElement
    ?.parentElement as HTMLDivElement
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
      cache.toggle.classList.add(props.icon.plus || "")
      cache.toggle.classList.remove(props.icon.minus || "")
      cache.submenu.style.height = "0"
      openMenus.set(parent, defaultValue)
      return
    }
    // 关闭的情况
    // 展开
    const defaultValue = { ...cache, open: true }

    // 往上递归 得到 parentSubMenu
    parentSubMenuCallback(parent)
    cache.toggle.classList.add(props.icon.minus || "")
    cache.toggle.classList.remove(props.icon.plus || "")
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
  toggle.classList.add(props.icon.minus || "")
  toggle.classList.remove(props.icon.plus || "")
  openMenus.set(parent, defaultValue)
}

// 过滤出可以用的路径
const filterPath = (item: AccordionMenuItem): string => {
  return item.path || item.redirect || item.to || ""
}
// 卸载
onBeforeUnmount(() => {
  openMenus.clear()
})
</script>

<style scoped lang="scss">
$item-bg: v-bind(titleBg);
$item-bg-hover: v-bind(titleBgHover);
$item-color: v-bind(titleColor);
$item-color-hover: v-bind(titleColorHover);
$sub-bg: v-bind(subBg);
$sub-bg-hover: v-bind(subBgHover);
$sub-color: v-bind(subColor);
$sub-color-hover: v-bind(subColorHover);
$menu-item-h: 35px;
$gap: var(--accordion-icon-gap);
$item-bg: transparent;
$ident: 20px;
// 组件容器
.menu-list {
  list-style: none;
  // 每一项
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $menu-item-h;
    position: relative;
    background-color: $item-bg;
    color: $item-color;
    // 悬浮
    &:hover {
      background: $item-bg-hover;
      color: $item-color-hover;
    }
    // 开始的 图标集合
    .start-icon {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      a {
        width: 100%;
        margin-left: $ident;
        display: flex;
        align-items: center;
        gap: $gap;
      }
    }
    // 切换按钮
    .toggle {
      z-index: 2;
      position: absolute;
      right: 0;
      top: 0;
      height: $menu-item-h;
      width: 35px;
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
