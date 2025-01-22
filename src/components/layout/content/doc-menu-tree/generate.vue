<template>
  <ul class="doc-menu-tree">
    <li v-for="item in menuData" :key="item.id" :class="'item-' + item.level">
      <a
        :href="`#${item.id}`"
        @click.prevent="scrollTo($event, `#${item.id}`)"
        ref="anchor"
        >{{ item.text }}</a
      >
      <GenerateMenuTree v-if="item.children.length" :menuData="item.children" />
    </li>
  </ul>
</template>

<script setup lang="ts" name="GenerateMenuTree">
// 引入 类型
import { mitt } from "@/utils/emitter"
import { TocNode } from "@/views/doc/review/types"
defineProps<{ menuData?: TocNode[] }>()

// 缓存
let headerHeight: null | number = null
let scrollToHeight: Map<string, number> | null = null
const anchor = ref()
let menus: HTMLAnchorElement[] | null = null

// 点击高亮
const clickHighlight = (tar: HTMLAnchorElement) => {
  // 停止监听
  mitt.emit("headinsObserver", false)
  if (!menus)
    menus = document.querySelectorAll<HTMLAnchorElement>(
      ".doc-menu-tree li a[href^='#']"
    ) as unknown as HTMLAnchorElement[]
  // 排他
  menus.forEach((item) => {
    item.classList.remove("active")
  })
  tar.classList.add("active")
}

// 点击 滚动
const scrollTo = (e: MouseEvent, id: string) => {
  const tar = document.querySelector(id) as HTMLHeadingElement
  if (!tar) return

  // 传入 对应需要高亮的信息
  const target = e.target as HTMLAnchorElement
  clickHighlight(target)

  // 初始化 Map
  if (!scrollToHeight) scrollToHeight = new Map()

  // 缓存不存在获取高度
  if (!headerHeight)
    headerHeight = (document.querySelector(".global-header") as HTMLDivElement)
      ?.offsetHeight

  // 有缓存 直接滚动
  const height = scrollToHeight.get(id)
  if (height) {
    window.scrollTo({
      top: height,
      behavior: "smooth",
    })
    return
  }

  const toScroll =
    tar.getBoundingClientRect().top +
    (document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop) -
    headerHeight -
    3

  // 无缓存则保存后滚动
  scrollToHeight.set(id, toScroll)
  window.addEventListener("animationend", () => {})
  window.scrollTo({
    top: toScroll,
    behavior: "smooth",
  })

  // 用于 监听 滚动是否完成
  let timeoutId: setTimout | null = null
  const onScroll = () => {
    if (timeoutId) clearTimeout(timeoutId)
    // 设置一个延迟，当滚动停止后触发回调
    timeoutId = setTimeout(() => {
      window.removeEventListener("scroll", onScroll) // 移除监听
      // 高亮完毕 继续监听
      mitt.emit("headinsObserver", true)
    }, 100) // 等待 100ms 后确认滚动完成
  }

  window.addEventListener("scroll", onScroll)
}

onBeforeUnmount(() => {
  // 清除Map
  scrollToHeight?.clear()
})
</script>

<style lang="scss">
// 目录编号
.doc-menu-tree {
  list-style: none;
  padding: 0;
  margin: 0;

  /* 初始化计数器 */
  counter-reset: level-2;

  li {
    $dot: var(--doc-content-seg);
    $endDot: var(--doc-content-seg-end);
    margin-left: var(--doc-menu-index);

    // 一级标题
    &.item-1 {
      margin-left: 0;
      counter-reset: level-2; /* 级别 2 编号从此处开始 */
    }

    a {
      @include pages-links-hover;
    }

    // #region 编号
    /* 二级编号 */
    &.item-2 {
      a {
        &::before {
          counter-increment: level-2; /* 增加二级编号计数器 */
          content: counter(level-2) $endDot; /* 显示二级编号 */
        }
        /* 嵌套组件有一层ul 需要清理计数器 */
        + .doc-menu-tree {
          counter-reset: level-3; /* 初始化 level-3 计数器（level-2 子级） */
        }
      }
    }

    /* 三级编号 */
    &.item-3 {
      a {
        &::before {
          counter-increment: level-3; /* 增加三级编号计数器 */
          content: counter(level-2) $dot counter(level-3) $endDot; /* 显示三级编号 */
        }

        /* 嵌套组件有一层ul 需要清理计数器 */
        + .doc-menu-tree {
          counter-reset: level-4; /* 初始化 level-4 计数器（level-3 子级） */
        }
      }
    }

    /* 四级编号 */
    &.item-4 {
      a {
        &::before {
          counter-increment: level-4; /* 增加四级编号计数器 */
          content: counter(level-2) $dot counter(level-3) $dot counter(level-4)
            $endDot; /* 显示四级编号 */
        }

        /* 嵌套组件有一层ul 需要清理计数器 */
        + .doc-menu-tree {
          counter-reset: level-5; /* 初始化 level-5 计数器（level-4 子级） */
        }
      }
    }

    /* 五级编号 */
    &.item-5 {
      a {
        &::before {
          counter-increment: level-5; /* 增加五级编号计数器 */
          content: counter(level-2) $dot counter(level-3) $dot counter(level-4)
            $dot counter(level-5) $endDot; /* 显示五级编号 */
        }

        /* 嵌套组件有一层ul 需要清理计数器 */
        + .doc-menu-tree {
          counter-reset: level-6; /* 初始化 level-6 计数器（level-5 子级） */
        }
      }
    }

    /* 六级编号 */
    &.item-6 {
      a {
        &::before {
          counter-increment: level-6; /* 增加六级编号计数器 */
          content: counter(level-2) $dot counter(level-3) $dot counter(level-4)
            $dot counter(level-5) $dot counter(level-6) $endDot; /* 显示六级编号 */
        }
      }
    }
    // #endregion 编号
  }
}
</style>
