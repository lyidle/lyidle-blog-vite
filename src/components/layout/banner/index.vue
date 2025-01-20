<template>
  <context-menu class="global-banner">
    <!-- 用于判断是否离开视口 固定header -->
    <div
      class="banner-observer absolute top-0 left-0 z-3 h-10px w-100% pointer-events-none"
    ></div>
    <div
      class="banner"
      :style="{
        height: height || bannerHeight,
        top: bannerIsFixed ? '0' : 'unset',
        zIndex: bannerIsFixed ? '1' : 'unset',
        position: bannerIsFixed ? 'fixed' : 'unset',
      }"
    >
      <div class="detail" v-if="context">
        <div class="title cur-text">{{ welcome }}</div>
        <div class="subtitle cur-text">
          <div v-if="poetry?.author">
            {{ poetry?.content }}--{{ poetry?.author }}
          </div>
          <!-- 默认的展示诗词 -->
          <div v-else>夜来疏雨鸣金井，一叶舞空红浅。--王月山</div>
        </div>
      </div>
    </div>
    <div class="fixed-replace" v-if="bannerIsFixed"></div>
  </context-menu>
</template>

<script setup lang="ts" name="Banner">
// 引入仓库
import { useSettingStore } from "@/store/setting"
import { useUserStore } from "@/store/user"
// 引入短诗接口
import { getPoetry } from "@/api/admin"

// 欢迎词
const welcome = import.meta.env.VITE_INITIAL_WELCOME

// props
withDefaults(
  defineProps<{
    mask?: string
    color?: string
    height?: string | null
    context?: boolean
  }>(),
  {
    mask: "var(--banner-mask)",
    color: "var(--banner-detail-color)",
    height: null,
    context: true,
  }
)

// 初始化仓库 暗夜模式自动切换图片等信息
const { isDark, bannerIsFixed } = storeToRefs(useSettingStore())

// 路由菜单
const { userBannerImg } = storeToRefs(useUserStore())
const route = useRoute()

// banner 图片
const bannerImg = ref()
const bannerHeight = ref()

// 监听 路径变化 和 暗夜切换 处理banner
watchEffect(() => {
  const banner = userBannerImg.value[route.path]
  if (isDark.value) {
    bannerImg.value = banner?.dark || "var(--default-img)"
    bannerHeight.value = banner?.height || "100vh"
    return
  }
  bannerImg.value = banner?.light || "var(--default-img)"
  bannerHeight.value = banner?.height || "100vh"
})

// 短诗
const poetry = ref()

// 监听 bannerIsFixed
watch(
  () => bannerIsFixed.value,
  (newV) => {
    if (newV) {
      // 固定
      document.body.setAttribute("banner-fixed", "fixed")
      return
    }
    // 没有固定
    document.body.setAttribute("banner-fixed", "")
  },
  {
    immediate: true,
  }
)

// 挂载
onMounted(async () => {
  try {
    // 发起请求 获取短诗
    const data = await getPoetry()
    poetry.value = data
  } catch (error) {}
})
</script>

<style scoped lang="scss">
.global-banner {
  .fixed-replace {
    width: 100%;
    height: 100vh;
  }
  .banner {
    width: 100%;
    height: 100vh;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    // 加一层遮罩 使文字更清晰
    background-image: v-bind(mask),
      // 背景
      v-bind(bannerImg);
    .detail {
      display: flex;
      flex-direction: column;
      align-items: center;
      // 禁止超出屏幕
      width: 80%;
      overflow: hidden;
      .title {
        font-size: 1.875rem;
        font-weight: 500;
        text-align: center;
        color: v-bind(color);
      }
      .subtitle {
        max-width: 100%;
        margin-top: 10px;
        text-align: center;
        font-size: 1.25rem;
        color: v-bind(color);
        overflow: hidden;
        // 省略号
        text-overflow: ellipsis;
        text-wrap: nowrap;
      }
      @include media(xs) {
        .title {
          font-size: 1.5625rem;
        }
        .subtitle {
          font-size: 0.9375rem;
        }
      }
    }
  }
}
</style>
