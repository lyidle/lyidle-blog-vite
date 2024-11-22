<template>
  <div
    class="banner"
    :style="{
      height: bannerHeight,
      top: bannerFixed ? '0' : '',
      zIndex: bannerFixed ? '-1' : '',
    }"
    ref="banner"
  >
    <div class="detail">
      <div class="title text">Welcome to LyidleのBlog</div>
      <div class="subtitle text">
        {{ sentence?.content }}--{{ sentence?.author }}
      </div>
    </div>
  </div>
  <div class="fixed-replace" v-if="bannerFixed"></div>
</template>

<script setup lang="ts" name="Home">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入短诗接口
import { getSentence } from "@/api/sentence"
withDefaults(
  defineProps<{
    img?: string
    mask?: string
    color?: string
  }>(),
  {
    img: "var(--banner-img)",
    mask: "var(--banner-mask)",
    color: "var(--banner-detail-color)",
  }
)
// 初始化仓库 暗夜模式自动切换图片等信息
let { isDark, bannerImg, bannerFixed, bannerHeight } = storeToRefs(
  useSettingStore()
)
const { setBanner } = useSettingStore()
const route = useRoute()
const sentence = ref()
const banner = ref()
onMounted(() => {
  setBanner(isDark.value, route)
  // 固定
  if (bannerFixed.value) {
    banner.value.style.position = "fixed"
  }
})
nextTick(async () => {
  // banner.value.style.backgroundImage = url
  const { data } = await getSentence()
  sentence.value = data
})
</script>

<style scoped lang="scss">
.fixed-replace {
  width: 100vw;
  height: 100vh;
}
.banner {
  width: 100vw;
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
      font-size: 30px;
      font-weight: 500;
      text-align: center;
      color: v-bind(color);
    }
    .subtitle {
      max-width: 100%;
      margin-top: 10px;
      text-align: center;
      font-size: 20px;
      color: v-bind(color);
      overflow: hidden;
      // 省略号
      text-overflow: ellipsis;
      text-wrap: nowrap;
    }
    @media screen and (max-width: $scr-xs) {
      .title {
        font-size: 25px;
      }
      .subtitle {
        font-size: 15px;
      }
    }
  }
}
</style>
