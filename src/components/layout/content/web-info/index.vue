<template>
  <layout-content-aside-card class="info-container" v-if="isDataShow">
    <template #title>
      <i class="i-fluent:data-histogram-16-filled"></i>
      <span>小站资讯</span>
    </template>
    <template #body>
      <div class="item text" v-if="webTotalPages">
        <div class="title">文章数目:</div>
        <div class="data">{{ webTotalPages }}</div>
      </div>
      <div class="item text" v-if="webTotalWords">
        <div class="title">本站总字数:</div>
        <div class="data">{{ webTotalWords }}</div>
      </div>
      <div class="item text" v-if="webUserCounts">
        <div class="title">本站用户数:</div>
        <div class="data">{{ webUserCounts }}</div>
      </div>
      <div class="item text" v-if="touristCounts">
        <div class="title">本站访客数:</div>
        <div class="data">{{ touristCounts }}</div>
      </div>
      <div class="item text" v-if="webTotalPersonCounts">
        <div class="title">本站总访问量:</div>
        <div class="data">{{ webTotalPersonCounts }}</div>
      </div>
      <div class="item text" v-if="webCreatedAt">
        <div class="title">本站创建时间:</div>
        <div class="data">{{ webCreatedAt }}</div>
      </div>
      <div class="item text" v-if="webUpdatedAt">
        <div class="title">最后更新时间:</div>
        <div class="data">{{ webUpdatedAt }}</div>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="WebInfo">
import { useWebInfoStore } from "@/store/aside/webInfo"

const {
  webTotalPages,
  webUserCounts,
  touristCounts,
  webTotalPersonCounts,
  webCreatedAt,
  webUpdatedAt,
  webTotalWords,
  isDataShow,
} = storeToRefs(useWebInfoStore())

const { reqWebInfo } = useWebInfoStore()
// 组件初始化 加载数据
onMounted(async () => {
  await reqWebInfo()
})
</script>

<style scoped lang="scss">
$item-gap: 5px;
.info-container {
  @include content-aside-title(var(--aside-web-info-icon-bg));
  ::v-deep(.body) {
    display: flex;
    flex-direction: column;
    gap: $item-gap;
    .item {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
