<template>
  <div
    class="space-nav"
    :style="{
      '--line-width': _width,
      '--line-left': _left,
      '--line-display': _display,
    }"
  >
    <ul class="nav" ref="navContainer">
      <li data-id="home" class="nav-item" :class="{ active: true }">
        <i class="icon i-mynaui:home"></i>
        <span class="label">主页</span>
      </li>
      <li data-id="collect" class="nav-item">
        <i class="icon i-hugeicons:star"></i>
        <span class="label">收藏</span>
      </li>
    </ul>
    <ul class="nav-right" ref="rightNavContainer">
      <li
        data-id="follower"
        class="nav-item cur-pointer"
        @click="activeNav('follower', 'normal')"
      >
        <span class="label">关注数</span>
        <span class="counts">{{ followerCounts || 0 }}</span>
      </li>
      <li
        data-id="following"
        class="nav-item cur-pointer"
        @click="activeNav('following')"
      >
        <span class="label">粉丝数</span>
        <span class="counts">{{ followingCounts || 0 }}</span>
      </li>
      <li class="nav-item cur-text">
        <span class="label">获赞数</span>
        <span class="counts">{{ likeCounts }}</span>
      </li>
      <li class="nav-item cur-text">
        <span class="label">浏览量</span>
        <span class="counts">{{ viewCounts }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="UserSpaceScene">
// 引入 api
import { getFollowerCounts, getFollowingCounts } from "@/api/user/follow"
import { getUserArticleLikes, getUserArticleViews } from "@/api/user/counts"
// 引入 类型
import type { userSpaceSceneType } from "./types"
// 引入 hooks
import { useEventListener } from "@/hooks/useEventListener"
// 引入 仓库
import { useUserSpaceStore } from "@/store/userSpace"

const props = defineProps<{ userId: number }>()

// 提取数据
const {
  // 关注数
  followerCounts,
  // 粉丝数
  followingCounts,
  // 获赞量
  likeCounts,
  // 浏览量
  viewCounts,
  // 场景信息
  scene,
} = storeToRefs(useUserSpaceStore())

// 获取 关注数
const reqFollowers = async () => {
  const counts = await getFollowerCounts(props.userId)
  followerCounts.value = counts || 0
}
// 获取 粉丝数
const reqFollowingCounts = async () => {
  const counts = await getFollowingCounts(props.userId)
  followingCounts.value = counts || 0
}
// 获取 获赞量
const reqViewLikes = async () => {
  const counts = await getUserArticleLikes(props.userId)
  likeCounts.value = counts || 0
}
// 获取 浏览量
const reqViewViews = async () => {
  const counts = await getUserArticleViews(props.userId)
  viewCounts.value = counts || 0
}

onMounted(async () => {
  await Promise.allSettled([
    reqFollowers(),
    reqFollowingCounts(),
    reqViewLikes(),
    reqViewViews(),
  ])
})

// 引入 路由
const router = useRouter()
const route = useRoute()

// 导航的 容器
const navContainer = ref()
const rightNavContainer = ref()
// 用于 控制 下划线的 索引
const _left = ref("0px")
// 用于 控制 下划线 的宽度
const _width = ref("60px")
const _display = ref("block")

// 左侧导航的子元素
let children: HTMLLIElement[]
// 初始化 元素
const initLineCallback = () => {
  let _children = navContainer?.value?.children as HTMLLIElement[]
  let _right_children = rightNavContainer.value?.children as HTMLLIElement[]
  // 初始化 左侧的导航元素
  children = Array.from(_children as HTMLLIElement[])
  // 初始化 右侧的导航元素
  children.push(..._right_children)
  // 初始化 右侧的元素
  // 初始 监听器
  watch(
    () => route.query,
    (query) => {
      const { to, group } = query
      const id = typeof to === "string" ? to : "home"
      activeNav(id as userSpaceSceneType, group as string)
    },
    {
      immediate: true,
    }
  )
}
// 初始化 元素
onMounted(initLineCallback)

// 激活 对应的元素
const activeNav = (id: userSpaceSceneType, group?: string) => {
  const el = children.find((item) => item.dataset.id === id)
  // 错误判断
  if (!el && id !== "follower" && id !== "following") {
    router.push(route.path + `?to=home`)
    return
  }
  if (
    id !== "collect" &&
    id !== "follower" &&
    id !== "following" &&
    id !== "home"
  ) {
    router.push(route.path + `?to=home`)
    return
  }

  // 跳转到对应的路径
  router.push(route.path + `?to=${id}` + `${group ? `&group=${group}` : ""}`)

  // 不是 右侧导航的 元素
  if (el && id !== "following" && id !== "follower") {
    // 排他 激活
    children.forEach((item) => item.classList.remove("active"))
    el.classList.add("active")
    const rect = el.getBoundingClientRect()
    _left.value = el.offsetLeft + "px"
    _width.value = rect.width + "px"
    // 设置 场景
    scene.value = id
    _display.value = "block"
    return
  }
  // 是 右侧的导航
  children.forEach((item) => item.classList.remove("active"))
  _display.value = "none"
  scene.value = id
}

// 向上查找 是否是 nav-item
const isNavItem = (el: HTMLElement | null | undefined) => {
  let find: HTMLElement | null | undefined | boolean = false
  const cur = (el: HTMLElement | null | undefined) => {
    // 是否 是导航项
    const is = el?.className.includes("nav-item")
    if (is) return (find = el)
    // 是否是 顶层父容器
    const isContainer = el?.className.includes("nav")
    if (isContainer) return
    cur(el?.parentElement)
  }
  cur(el)
  return find as HTMLElement | boolean
}
// 监听 左侧 li 的点击事件 使用事件委托
useEventListener(navContainer, "click", (e: Event) => {
  const tar = e.target as HTMLLIElement
  // 判断是否是 导航项
  const el = isNavItem(tar)
  if (!el) return
  // 激活对应的 元素
  const id = (el as HTMLLIElement).dataset.id as userSpaceSceneType
  if (id) activeNav(id)
})
</script>

<style scoped lang="scss">
// 导航的高度
$height: 50px;
// 每一项的距离
$gap: 10px;
// 左侧icon的间距 和右侧的 上下间距
$min-gap: 3px;
// 激活状态的 下划线
$line-h: 4px;
// 激活状态的颜色
$active-color: #98a3ea;
.space-nav {
  height: $height;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  // 左侧导航
  > .nav {
    display: flex;
    height: 100%;
    gap: $gap;
    position: relative;
    > .nav-item {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: var(--cursor-pointer);
      gap: $min-gap;
      .icon {
        font-size: 20px;
      }
      .label {
        font-size: 16px;
        font-weight: bold;
      }
      &.active {
        color: #{$active-color};
      }
      &:hover {
        color: #{$active-color};
      }
    }
    // 下滑线
    &::after {
      display: var(--line-display);
      content: "";
      width: var(--line-width);
      height: $line-h;
      position: absolute;
      bottom: 0;
      left: var(--line-left);
      background-color: $active-color;
      border-radius: 10px;
      transition: left var(--primary-during);
    }
  }
  // 右侧导航
  .nav-right {
    height: 100%;
    display: flex;
    justify-content: space-between;
    gap: $gap;
    .nav-item {
      height: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: $min-gap;
      &:not(.cur-text):hover {
        color: $active-color;
      }
    }
  }
}
</style>
