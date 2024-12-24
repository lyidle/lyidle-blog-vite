<template>
  <layout-content-aside-card v-if="announce">
    <template #title>
      <i class="i-icon-park-twotone:announcement"></i>
      <span>公告</span>
    </template>
    <template #body>
      <div class="text">{{ announce }}</div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="WebNotification">
import { useAnnounceAndRecentPagesStore } from "@/store/aside/announceAndRecentPages"
const { announce } = storeToRefs(useAnnounceAndRecentPagesStore())
const { reqAnnounce } = useAnnounceAndRecentPagesStore()
// 发起请求
onMounted(async () => {
  await reqAnnounce()
})
</script>

<style scoped lang="scss">
@include content-aside-title(var(--aside-web-announce-icon-bg));
</style>
