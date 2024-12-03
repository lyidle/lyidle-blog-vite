<template>
  <div class="contain menu">
    <ul class="header-menu" ref="menu">
      <template v-for="item in userStore.menuList" :key="item.id">
        <li>
          <router-link :to="item.children ? '' : item.to" v-if="item.to">
            <div class="title" @click="toggle(item.id)">
              <i :class="item.icon"></i>
              {{ item.title }}
              <div
                v-if="item.children"
                class="i-ic:baseline-plus w-1em h-1em right"
              />
            </div>
          </router-link>
          <a v-else>
            <div class="title" @click="toggle(item.id)">
              <i :class="item.icon"></i>
              {{ item.title }}
              <div
                v-if="item.children"
                class="i-ic:baseline-plus w-1em h-1em right"
              />
            </div>
          </a>
          <ul class="contain" v-if="item.children" :data-id="item.id">
            <template v-for="sub in item.children" :key="item.id">
              <router-link :to="sub.to">
                <li class="subtitle">
                  <i :class="sub.icon"></i>{{ sub.name }}
                </li>
              </router-link>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts" name="HeaderMenuMini">
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
const userStore = useUserStore()
// interface subStroreType {
//   id: string | number
//   flag: boolean
//   height: string
// }
// 记录值去重
let subStore = reactive(new Map())
const menu = ref()
const toggle = (id: number | string) => {
  const result = userStore.menuList.find((item) => {
    if (item.id === id) return true
  })
  // 不存在则是一级菜单直接退出
  const menu = result?.children
  if (!menu) return
  const { height, flag, element, toggle } = subStore.get(`${id}`)
  if (flag) {
    element.style.height = height + "px"
    toggle.classList.remove(icon?.plus)
    toggle.classList.add(icon?.minus)
    subStore.set(`${id}`, { height, flag: false, element, toggle })
  } else {
    element.style.height = 0
    toggle.classList.remove(icon?.minus)
    toggle.classList.add(icon?.plus)
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
    const toggle = element.previousSibling.querySelector(".right")
    // id 是dataset上的 是字符串 ，取的时候也要字符串
    subStore.set(id, { height, flag: true, element, toggle })
  }
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
    // 上下边距撑开容器
    padding: 10px 0;
    display: flex;
    align-items: center;
    // 图标和文字的距离
    gap: 10px;
    box-sizing: border-box;
    > i {
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
      right: 10px;
      cursor: pointer;
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
