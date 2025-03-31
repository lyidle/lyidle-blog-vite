<template>
  <my-card class="msg-container card_style flex">
    <!-- 侧边栏 -->
    <aside
      class="nav-container bg-[var(--msg-bg)] flex flex-col items-center gap-0.9375rem flex-shrink-0"
    >
      <div class="text-1.1875rem cur-text flex items-center gap-5px mt-1.25rem">
        <i class="i-uil:message w-1.125rem h-1.125rem"></i>消息中心
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
    <div class="w-100% p-10px flex flex-col gap-15px">
      <!-- title -->
      <div
        class="bg-[var(--msg-bg)] flex-shrink-0 text-1.0625rem rounded-[var(--r)] cur-text py-10px pl-15px"
      >
        我的消息
      </div>
      <!-- 内容 -->
      <div
        class="bg-[var(--msg-bg)] rounded-[var(--r)] h-100% overflow-y-auto overflow-hidden"
      >
        <!-- 回复我的 -->
        <layout-msg-reply v-if="$route.query.to === 'reply'"></layout-msg-reply>
      </div>
    </div>
  </my-card>
</template>

<script setup lang="ts" name="UserMessage">
// 引入类型
import type { sceneMsgType } from "./types"

const route = useRoute()
const router = useRouter()
// 当前 页面 路径
const curPath = route.path

// 场景的 常量
const sceneArr = ["whisper", "reply", "at", "like", "system", "config"] as const

// 控制场景
const scene = ref<sceneMsgType>("whisper")

// 切换 场景
watch(
  () => route.query,
  (query) => {
    const { to } = query as { to: sceneMsgType }
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
</script>

<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle(scend-opacity, false);
.msg-container {
  // 圆角
  --r: 8px;
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
  @include media(sm) {
    width: 90%;
  }
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
    }
  }
}
</style>
