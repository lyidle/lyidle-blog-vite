<template>
  <my-card class="msg-container card_style flex relative !overflow-y-auto">
    <div class="flex min-h-400px flex-1">
      <div class="flex-shrink-0 flex items-center">
        <!-- 侧边栏 -->
        <aside
          class="nav-container msg-box flex flex-col h-100% items-center gap-[var(--gap-y)] flex-shrink-0"
          ref="navContainer"
        >
          <div
            class="text-1.1875rem cur-text flex items-center gap-5px mt-1.25rem title"
          >
            <i class="i-uil:message"></i>消息中心
          </div>
          <ul class="nav">
            <li
              class="nav-item-container"
              @click="$router.push(`${curPath}?to=whisper`)"
              :class="{ active: $route.query.to === 'whisper' }"
            >
              <i class="i-lucide:dot"></i>我的消息
            </li>
            <li
              class="nav-item-container"
              @click="$router.push(`${curPath}?to=reply`)"
              :class="{ active: $route.query.to === 'reply' }"
            >
              <i class="i-lucide:dot"></i>回复我的
            </li>
            <li
              class="nav-item-container"
              @click="$router.push(`${curPath}?to=at`)"
              :class="{ active: $route.query.to === 'at' }"
            >
              <i class="i-lucide:dot"></i>@我的
            </li>
            <li
              class="nav-item-container"
              @click="$router.push(`${curPath}?to=like`)"
              :class="{ active: $route.query.to === 'like' }"
            >
              <i class="i-lucide:dot"></i>收到的赞
            </li>
            <li
              class="nav-item-container"
              @click="$router.push(`${curPath}?to=system`)"
              :class="{ active: $route.query.to === 'system' }"
            >
              <i class="i-lucide:dot"></i>系统通知
            </li>
          </ul>
        </aside>
        <!-- toggle -->
        <div class="toggle" @click="handlerFold"></div>
      </div>
      <div class="msg-content p-0.625rem flex-1 flex-shrink-0 overflow-hidden">
        <!-- title -->
        <div
          class="msg-box text-0.9688rem cur-text py-0.625rem pl-[var(--p)] flex items-center"
        >
          {{ sceneZh[$route.query.to as sceneMsgType] }}
          <!-- 收到的赞二级 -->
          <span v-if="$route.query.to === 'like' && $route.query.type">
            <i class="i-ep:arrow-right w-15px h-15px translate-y-1px"></i
            >点赞详情
          </span>
        </div>
        <!-- 内容 -->
        <div class="msg-scene overflow-y-auto">
          <!-- 回复我的 -->
          <layout-msg-reply
            v-if="$route.query.to === 'reply'"
          ></layout-msg-reply>
          <layout-msg-like v-if="$route.query.to === 'like'"></layout-msg-like>
          <layout-msg-at v-if="$route.query.to === 'at'"></layout-msg-at>
          <layout-msg-whisper
            v-if="$route.query.to === 'whisper'"
          ></layout-msg-whisper>
        </div>
      </div>
    </div>
  </my-card>
</template>

<script setup lang="ts" name="UserMessage">
// 引入类型
import { mitt } from "@/utils/emitter"
import type { sceneMsgType } from "./types"

const route = useRoute()
const router = useRouter()
// 当前 页面 路径
const curPath = route.path

// 场景的 常量
const sceneArr: sceneMsgType[] = [
  "whisper",
  "reply",
  "at",
  "like",
  "system",
  "config",
]
// 场景 映射中文
const sceneZh = {
  whisper: "我的消息",
  reply: "回复我的",
  at: "@我的",
  like: "收到的赞",
  system: "系统通知",
  config: "消息设置",
}

// 控制场景
const scene = ref<sceneMsgType>("whisper")

// 切换 场景
watch(
  () => route.query,
  (query) => {
    const { to } = query as { to: sceneMsgType }
    // 先判断 有无 to 与是否合法 提示
    if (to && !sceneArr.includes(to)) {
      nextTick(() => ElMessage.warning("to的路径不合法"))
    }
    // 先判断 有无 to 与是否合法 违规则 设置
    if (!to || !sceneArr.includes(to)) {
      router.push(`${curPath}?to=whisper`)
      scene.value = "whisper"
      return
    }
    scene.value = to
  },
  {
    immediate: true,
  }
)
// 侧边栏容器
const navContainer = ref<HTMLDivElement>()
// 处理侧边栏的 收起与展开
const handlerFold = () => {
  const tar = navContainer.value
  if (!tar) return
  const is = tar.classList.contains("fold")
  if (is) tar.classList.remove("fold")
  else tar.classList.add("fold")
}

// 小屏尺寸 自动折叠
const mini = 768
const autoFold = () => {
  if (window.innerWidth <= mini) {
    const tar = navContainer.value
    if (!tar) return
    tar.classList.add("fold")
  }
}
onMounted(autoFold)
mitt.on("window:resize", autoFold)
onBeforeUnmount(() => mitt.off("window:resize", autoFold))
</script>

<style lang="scss">
// 容器的基础样式
.msg-box,
.msg-scene {
  background-color: var(--msg-bg);
  border-radius: var(--r);
}
</style>
<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle(scend-opacity, false);
.msg-container {
  // 圆角
  --r: 8px;
  // 常用的 内边距
  --p: 15px;
  // 常用的 上下gap
  --gap-y: 15px;
  position: fixed;
  height: 80%;
  width: 80%;
  // 水平居中
  inset: 0;
  // 需要 移动到 导航条下方
  top: var(--header-height);
  margin: auto;
  z-index: $global-content-index;
  transition: width var(--primary-during);
  color: var(--primary-color);
  // 左侧 导航
  .nav-container {
    width: 9.375rem;
    .nav {
      --i-size: 1.875rem;
      width: 100%;
      .nav-item-container {
        // 垂直居中和 内边距 撑开
        display: flex;
        align-items: center;
        padding: 0.3125rem 0.3125rem;
        cursor: var(--cursor-pointer);
        font-size: 1rem;
        // 图标
        i {
          width: var(--i-size);
          height: var(--i-size);
        }
        &:hover {
          background-color: var(--msg-bg);
        }
        &.active {
          background-color: var(--msg-bg);
          color: var(--primary-links-hover);
        }
        // 使用 link 的样式
        @include pages-links-hover;
      }
      @include media(xs) {
        --i-size: 0.9375rem;
        .nav-item-container {
          $py: 0.625rem;
          padding-top: $py;
          padding-bottom: $py;
        }
      }
    }
  }

  // 右侧信息
  .msg-content {
    display: grid;
    grid-template-rows: 40px 1fr;
    gap: var(--gap-y);
  }

  @include media(sm) {
    width: 95%;
  }
  // 切换按钮 平时隐藏 小屏时显示
  .toggle {
    display: none;
  }
  @include media(xs) {
    width: 100%;
    min-height: calc(100% - var(--header-height) - 20px);
    // 切换按钮
    .toggle {
      display: none;
      display: block;
      $w: 10px;
      width: $w;
      height: 50px;
      background-color: rgba(146, 187, 209, 0.507);
      border-radius: 10px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      cursor: var(--cursor-pointer);
    }
    // 右侧信息
    .msg-content {
      padding-left: 5px;
    }
    // 左侧 导航
    .nav-container {
      width: 100px;
      height: 100%;
      transition: width var(--primary-during);
      &.fold {
        width: 0;
        overflow: hidden;
      }
      .nav {
        text-wrap: nowrap;
      }
      .title {
        font-size: 1rem;
        gap: 0.125rem;
        text-wrap: nowrap;
        i {
          $i-size: 0.9375rem;
          width: $i-size;
          height: $i-size;
        }
      }
    }
  }
}
</style>
