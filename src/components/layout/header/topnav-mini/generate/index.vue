<template>
  <div class="">
    <ul class="header-menu" ref="menu">
      <template v-for="item in userStore.userMenuList" :key="item.id">
        <li v-if="item.id">
          <div class="title">
            <!-- 有 to 的 则 重定向 -->
            <router-link
              :to="item.to || item.children?.[0]?.to || ''"
              v-if="item.to || item.children?.[0]?.to"
            >
              <i :class="item.icon"></i>
              {{ item.name }}
            </router-link>
            <!-- 没有的 -->
            <a v-else>
              <i :class="item.icon" class="w-1em h-1em"></i>
              {{ item.name }}
            </a>
            <div
              class="right cur-pointer"
              @click="toggle(item.id)"
              v-if="JSON.stringify(item.children) !== '[]'"
            >
              <i class="toggle i-ic:baseline-plus w-1em h-1em"></i>
            </div>
          </div>
          <ul class="contain" v-if="item.children" :data-id="item.id">
            <template v-for="sub in item.children" :key="item.id">
              <li class="subtitle">
                <!-- 有 to 的 则 router-link -->
                <router-link :to="sub.to" v-if="sub.to">
                  <i :class="sub.icon"></i>{{ sub.name }}
                </router-link>
                <!-- 没有的 -->
                <a v-else> <i :class="sub.icon"></i>{{ sub.name }} </a>
              </li>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts" name="TopNavMiniMenuList">
// 引入仓库
import { useUserStore } from "@/store/user"

// 定义接收的颜色值
const props = withDefaults(
  defineProps<{
    style?: {
      icon?: { plus?: string; minus?: string }
      titleBg: string
      titleBgHover: string
      titleColor: string
      titleColorHover: string
      subtitleBg: string
      subtitleBgHover: string
      subtitleColor: string
      subtitleColorHover: string
    }
  }>(),
  {
    style: () => ({
      icon: { plus: "i-ic:baseline-plus", minus: "i-ic:baseline-minus" },
      titleBg: "transparent",
      titleBgHover: "#57aae1",
      titleColor: "#203b5b",
      titleColorHover: "#e9f6ff",
      subtitleBg: "transparent",
      subtitleBgHover: "rgb(173, 227, 248)",
      subtitleColor: "#203b5b",
      subtitleColorHover: "#62addf",
    }),
  }
)
// 定义接收的颜色值
const {
  icon,
  titleBg,
  titleBgHover,
  titleColor,
  titleColorHover,
  subtitleBg,
  subtitleBgHover,
  subtitleColor,
  subtitleColorHover,
} = props.style

// 使用仓库
const userStore = useUserStore()

// 定义map数据
interface subStroreType {
  flag: boolean
  height: string
  element: HTMLDivElement
  toggle: HTMLDivElement
}

// 记录值去重
const subStore: Map<string, subStroreType> = new Map()

// 菜单容器实列
const menu = ref()

const toggle = (id: number | string) => {
  const result = userStore.userMenuList?.find((item) => {
    if (item.id === id) return true
  })
  // 不存在则是一级菜单直接退出
  const menu = result?.children
  if (!menu) return
  const { height, flag, element, toggle } = subStore.get(
    `${id}`
  ) as subStroreType
  if (flag) {
    element.style.height = height + "px"
    toggle.classList.remove(icon?.plus as string)
    toggle.classList.add(icon?.minus as string)
    subStore.set(`${id}`, { height, flag: false, element, toggle })
  } else {
    element.style.height = "0"
    toggle.classList.remove(icon?.minus as string)
    toggle.classList.add(icon?.plus as string)
    subStore.set(`${id}`, { height, flag: true, element, toggle })
  }
}

onMounted(() => {
  // 初始化时获取到二级菜单的存放到map中高度
  const nodeList = menu.value.querySelectorAll(".contain")
  for (let i = 0; i < nodeList.length; i++) {
    const element = nodeList[i]
    // 记录id
    const id = element.dataset.id
    element.style.height = "auto"
    // 记录高度
    const height = element.offsetHeight
    element.style.height = "0"
    const toggle = element.previousSibling.querySelector(".right .toggle")
    // id 是dataset上的 是字符串 ，取的时候也要字符串
    subStore.set(id, { height, flag: true, element, toggle })
  }
})

onUnmounted(() => {
  subStore.clear()
})
</script>

<style scoped lang="scss">
$item-ident: 20px;
$menu-radius: 5px;
.header-menu {
  border-radius: 10px;
  overflow: hidden;
  border-radius: $menu-radius;
  // 初始化布局
  .title,
  .subtitle {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    a {
      display: flex;
      width: 100%;
      // 图标和文字的距离
      gap: 10px;
      // 上下边距撑开容器
      padding: 10px 0;
    }
    i:not(.toggle) {
      // 左边距
      margin-left: $item-ident;
    }
  }
  // 一级菜单样式
  .title {
    background-color: v-bind(titleBg);
    color: v-bind(titleColor);
    position: relative;
    .right {
      position: absolute;
      right: 0;
      width: 40px;
      height: 100%;
      display: flex;
      justify-content: end;
      align-items: center;
      i {
        margin-right: 10px;
      }
    }
    // 悬浮样式
    &:hover {
      background-color: v-bind(titleBgHover);
      color: v-bind(titleColorHover);
    }
  }
  .expand {
    position: absolute;
    right: 30px;
  }
  // 二级菜单样式
  .contain {
    height: auto;
    overflow: hidden;
    transition: height 0.5s;
    // 左边距
    padding-left: $item-ident;
    box-sizing: border-box;
    .subtitle {
      background-color: v-bind(subtitleBg);
      color: v-bind(subtitleColor);
      // 悬浮样式
      &:hover {
        background-color: v-bind(subtitleBgHover);
        color: v-bind(subtitleColorHover);
      }
    }
  }
}
</style>
