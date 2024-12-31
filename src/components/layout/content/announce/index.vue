<template>
  <layout-content-aside-card v-if="announce">
    <template #title>
      <i class="i-icon-park-twotone:announcement"></i>
      <span>公告</span>
    </template>
    <template #body>
      <div class="text">{{ announce }}</div>
      <div class="region">
        <div class="title text">
          🎉欢迎信息<span class="rotate-y-180deg inline-block">🎉</span>
        </div>
        <div class="content">
          <span class="text">欢迎来自</span>
          <span class="info text">{{ region?.country }} </span>
          <span class="info text">{{ region?.province }} </span>
          <span class="info text"> {{ region?.city }}</span>
          <span class="text">的小伙伴,当前的ip地址为:</span>
          <span class="info text">{{ region?.userIp }}</span>
          <span class="text">,现在时间为：{{ currentTime }}</span>
        </div>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="WebNotification">
// 引入仓库
import { useAnnounceAndRecentPagesStore } from "@/store/aside/announceAndRecentPages"
import moment from "@/utils/moment"
// 提取需要的数据
const { announce, region } = storeToRefs(useAnnounceAndRecentPagesStore())
// 提取请求
const { reqAnnounce } = useAnnounceAndRecentPagesStore()
const currentTime = ref(moment(new Date(), "a h:mm:ss"))
let updateTime: ReturnType<typeof setInterval>
// 发起请求
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
@include content-aside-title(var(--aside-web-announce-icon-bg));
$welcome-info-gap: 3px;
$welcome-info-color: #125a8a;
$welcome-bg: rgb(227, 255, 254);
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
  .content {
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
