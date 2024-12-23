<template>
  <layout-content-aside-card>
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
import { getAnnounce } from "@/api/admin"
const announce = ref<string>("")
onBeforeMount(async () => {
  const result = await getAnnounce()
  announce.value = result.announce
})
</script>

<style scoped lang="scss">
@include content-aside-title(var(--aside-web-announce-icon-bg));
</style>
