<template>
  <layout-content-aside-card v-if="announce">
    <template #title>
      <i class="i-icon-park-twotone:announcement"></i>
      <span>公告</span>
    </template>
    <template #body>
      <div class="cur-text">{{ announce.content }}</div>
      <div class="region">
        <div class="title cur-text">
          🎉欢迎信息<span class="rotate-y-180deg inline-block">🎉</span>
        </div>
        <div class="content">
          <span class="cur-text">欢迎来自</span>
          <span class="info cur-text" v-if="region_country"
            >{{ region_country }}
          </span>
          <span class="info cur-text" v-if="region_province"
            >{{ region_province }}
          </span>
          <span class="info cur-text" v-if="region_city">
            {{ region_city }}</span
          >
          <span class="cur-text" v-if="!region_userIp">未知区域</span>
          <span class="cur-text">的小伙伴</span>
          <span class="cur-text" v-if="region_userIp">,当前的ip地址为:</span>
          <span class="info cur-text" v-if="region_userIp">{{
            region_userIp
          }}</span>
          <span class="cur-text">,现在时间为：{{ currentTime }}</span>
        </div>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="AsideAnnounce">
// 引入 moment
import moment from "@/utils/moment"
// 引入 仓库
import { useAnnounceStore } from "@/store/announce/index"
// 显示当前时间
const currentTime = ref(moment(new Date(), "a h:mm:ss"))
// 记录当前时间的 setInterval
let updateTime: ReturnType<typeof setInterval>

// 提取相关 信息
const { reqAnnounce } = useAnnounceStore()
const {
  // 展示的数据
  announce,
  region_city,
  region_country,
  region_province,
  region_userIp,
} = storeToRefs(useAnnounceStore())

// 初始化 发起请求
onMounted(async () => {
  await reqAnnounce()
  // 自动更新 时间
  updateTime = setInterval(() => {
    currentTime.value = moment(new Date(), "a h:mm:ss")
  }, 1000)
})

onUnmounted(() => {
  clearInterval(updateTime)
})
</script>

<style scoped lang="scss">
@include content-aside-title(var(--aside-title-icon-bg));
$welcome-info-gap: 3px;
$welcome-info-color: var(--aside-announce-welcome-color);
$welcome-bg: var(--aside-announce-welcome-bg);
$item-gap: 10px;
.region {
  background-color: $welcome-bg;
  border-radius: var(--pages-card-radius);
  overflow: hidden;
  padding: $item-gap;
  margin-top: $item-gap;
  .title {
    text-align: center;
    margin-bottom: $item-gap;
    font-weight: bold;
  }
  > .content {
    span {
      // 可在任意字符间断行
      word-break: break-all;
      line-height: 1.5625rem;
      &.info {
        color: $welcome-info-color;
        margin: 0 $welcome-info-gap;
        font-weight: bold;
      }
    }
  }
}
</style>
