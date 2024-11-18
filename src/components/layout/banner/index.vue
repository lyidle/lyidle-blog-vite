<template>
  <div class="banner" ref="banner">
    <div class="detail">
      <div class="title text">Welcome to LyidleのBlog</div>
      <div class="subtitle text">
        {{ sentence?.content }}--{{ sentence?.author }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
// 彼岸花开开彼岸,忘川河畔亦忘川。奈何桥头空奈何,三生石上写三生。
// 引入短诗接口
import { getSentence } from "@/api/sentence"
const props = defineProps({
  height: {
    type: String,
    default: "50vh",
  },
  url: {
    type: String,
    default: 'url("/static/images/base-bg-light-01.png")',
  },
})
const banner = ref()
const height = props.height
const url = props.url
const sentence = ref()
nextTick(async () => {
  banner.value.style.height = height
  // banner.value.style.backgroundImage = url
  const { data } = await getSentence()
  sentence.value = data
})
</script>

<style scoped lang="scss">
.banner {
  width: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
      to right,
      rgba(137, 137, 137, 0.5),
      rgba(137, 137, 137, 0)
    ),
    url("/static/images/base-bg-light-01.png");
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
      color: var(--banner-detail-color-light);
    }
    .subtitle {
      max-width: 100%;
      margin-top: 10px;
      text-align: center;
      font-size: 20px;
      color: var(--banner-detail-color-light);
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
