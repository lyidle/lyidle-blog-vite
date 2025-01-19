<template>
  <context-menu class="global-banner">
    <!-- 用于判断是否离开视口 固定header -->
    <div
      class="banner-observer absolute top-0 left-0 z-3 h-10px w-100% pointer-events-none"
    ></div>
    <div
      class="banner"
      :style="{
        height: height || banner?.bannerImg?.height,
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
// 引入类型
import type { Datum as MenuListDatum } from "@/api/admin/types/getMenuList"
import { mitt } from "@/utils/emitter"
// 欢迎词
const welcome = import.meta.env.VITE_INITIAL_WELCOME
// props
withDefaults(
  defineProps<{
    img?: string
    mask?: string
    color?: string
    height?: string | null
    context?: boolean
  }>(),
  {
    img: "var(--banner-img)",
    mask: "var(--banner-mask)",
    color: "var(--banner-detail-color)",
    height: null,
    context: true,
  }
)
// 初始化仓库 暗夜模式自动切换图片等信息
const { isDark, bannerIsFixed } = storeToRefs(useSettingStore())

// 路由菜单
const { userMenuList } = storeToRefs(useUserStore())
const route = useRoute()

// 缓存当前路径
let path: string | null = null

const banner = computed(() => {
  // 包含当前路径退出
  if (path && (path as string).includes(route.path)) return
  let result: MenuListDatum | null = null
  const recursive = (item: MenuListDatum[]) => {
    const multi = (item: MenuListDatum[]) => {
      for (let i = 0; i < item?.length; i++) {
        const obj = item[i]
        if (obj.to?.includes(route.path)) {
          result = obj
          return
        }
        if (obj.children) {
          return multi(obj.children)
        }
      }
    }
    multi(item)
  }
  if (userMenuList.value) recursive(userMenuList.value)
  return result as MenuListDatum | null
})

// banner 图片
const bannerImg = computed(() => {
  const img = isDark.value
    ? banner.value?.bannerImg?.dark
    : banner.value?.bannerImg?.light
  return img || "var(--default-img)"
})

// 短诗
const poetry = ref()

// 监听 bannerIsFixed
watch(
  () => bannerIsFixed.value,
  (newV) => {
    newV && mitt.emit("bannerIsFixed:true")
    !newV && mitt.emit("bannerIsFixed:false")
  },
  {
    immediate: true,
  }
)

// 发起请求
onMounted(async () => {
  try {
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
