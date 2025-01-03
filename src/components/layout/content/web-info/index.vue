<template>
  <layout-content-aside-card class="info-container" v-if="isDataShow">
    <template #title>
      <i class="i-fluent:data-histogram-16-filled"></i>
      <span>小站资讯</span>
    </template>
    <template #body>
      <div class="item cur-text" v-if="webTotalPages">
        <div class="title">文章数目:</div>
        <div class="data">{{ webTotalPages }}</div>
      </div>
      <div class="item cur-text" v-if="webTotalWords">
        <div class="title">本站总字数:</div>
        <div class="data">{{ webTotalWords }}</div>
      </div>
      <div class="item cur-text" v-if="webUserCounts">
        <div class="title">本站用户数:</div>
        <div class="data">{{ webUserCounts }}</div>
      </div>
      <div class="item cur-text" v-if="touristCounts">
        <div class="title">本站访客数:</div>
        <div class="data">{{ touristCounts }}</div>
      </div>
      <div class="item cur-text" v-if="webTotalPersonCounts">
        <div class="title">本站总访问量:</div>
        <div class="data">{{ webTotalPersonCounts }}</div>
      </div>
      <div class="item cur-text" v-if="webCreatedAt">
        <div class="title">本站创建时间:</div>
        <div class="data">{{ webCreatedAt }}</div>
      </div>
      <div class="item cur-text" v-if="webUpdatedAt">
        <div class="title">最后更新时间:</div>
        <div class="data">{{ webUpdatedAt }}</div>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="AsideWebInfo">
// 引入api
import { getWebInfo } from "@/api/webInfo"
// 引入计数 转换函数
import numberTransform from "@/utils/numberTransform"
// 引入 moment
import moment from "@/utils/moment"

// 显示的数据
const webTotalPages = ref<string>()
const webUserCounts = ref<string>()
const touristCounts = ref<string>()
const webTotalPersonCounts = ref<string>()
const webCreatedAt = ref<ReturnType<typeof moment> | string>()
const webUpdatedAt = ref<ReturnType<typeof moment> | string>()
const webTotalWords = ref<string>()

// 判断是否有数据 显示和隐藏小站咨询
const isDataShow = computed(() => {
  return (
    webTotalPages.value ||
    webTotalWords.value ||
    webUserCounts.value ||
    touristCounts.value ||
    webTotalPersonCounts.value ||
    webCreatedAt.value ||
    webUpdatedAt.value
  )
})

// 发起请求
const reqWebInfo = async () => {
  const {
    webTotalPages: totalPages,
    webUserCounts: userCounts,
    touristCounts: tourists,
    webTotalPersonCounts: totalPersonCounts,
    webCreatedAt: createdAt,
    webUpdatedAt: updatedAt,
    webTotalWords: totalWords,
  } = await getWebInfo()

  // 整理参数
  if (totalPages) webTotalPages.value = numberTransform(totalPages)
  if (userCounts) webUserCounts.value = numberTransform(userCounts)
  if (tourists) touristCounts.value = numberTransform(tourists)
  if (totalPersonCounts)
    webTotalPersonCounts.value = numberTransform(totalPersonCounts)
  if (createdAt) webCreatedAt.value = moment(createdAt)
  if (updatedAt) webUpdatedAt.value = moment(updatedAt)
  if (totalWords) webTotalWords.value = numberTransform(totalWords)
}

// 组件初始化 加载数据
onMounted(async () => {
  await reqWebInfo()
  if (!isDataShow.value) ElMessage.warning("小站咨询加载失败~")
})
</script>

<style scoped lang="scss">
$item-gap: 5px;
.info-container {
  @include content-aside-title(var(--aside-title-icon-bg));
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
