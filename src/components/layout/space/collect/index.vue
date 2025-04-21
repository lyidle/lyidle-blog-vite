<template>
  <div class="flex items-center mb-20px">
    <span class="text-26px font-bold">文章</span>
    <span>·{{ pagination?.total || 0 }}</span>
  </div>
  <template v-if="pagination?.total">
    <div
      class="contain"
      :style="{ '--pages-card-contentNum': layoutRef?.contentNum }"
    >
      <layout-content-card v-for="item in list" :article="item" v-if="list">
      </layout-content-card>
    </div>
    <div class="flex justify-center mt-30px">
      <my-pagination
        v-if="pagination?.total"
        background
        layout="prev, pager, next, sizes"
        :total="pagination.total"
        :page-sizes="[10, 20, 30]"
        @change="reqArticles"
      />
    </div>
  </template>
  <my-empty v-else></my-empty>
</template>

<script setup lang="ts" name="UserSpaceCollect">
// 引入 api
import { getOneArticle } from "@/api/article"
import { getCollects } from "@/api/user/collect"
// 引入 类型
import type { GetCollects } from "@/api/user/collect/types/getCollects"
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
// 处理错误信息
import { handlerReqErr } from "@/utils/request/error/successError"
// 引入 仓库
import { useUserSpaceStore } from "@/store/userSpace"

defineProps<{ account: string }>()
const layoutRef = defineModel<{ contentNum: number }>("layoutRef")
const { userInfo } = storeToRefs(useUserSpaceStore())

// 存储文章信息
const list = ref<GetOneArticle["data"][]>()
const pagination = ref<GetCollects["data"]["pagination"]>()
// 得到 文章信息
const reqArticles = async (currentPage: number = 1, pageSize: number = 10) => {
  if (!userInfo.value?.id) return
  try {
    const result = await getCollects({
      userId: userInfo.value?.id,
      currentPage,
      pageSize,
    })
    const arts = await Promise.all(
      result.list.map(async (item) => {
        const artId = item.articleId
        console.log(artId)
        return await getOneArticle(artId)
      })
    )
    list.value = arts
    pagination.value = result.pagination
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage("获取文章信息失败")
  }
}

onMounted(() => {
  let isErr = false
  const stopWatch = watch(
    () => userInfo.value,
    async (newV) => {
      if (!newV) return
      await reqArticles()
      try {
        stopWatch()
      } catch (error) {
        isErr = true
      }
    },
    {
      immediate: true,
    }
  )
  if (isErr) stopWatch()
})
</script>

<style scoped lang="scss">
// 左右间距
$item-gap: var(--content-gap);
$translate-y: -5px;
// 内容区域卡片
.contain {
  width: 100%;
  display: flex;
  // 内容区域卡片的间距
  gap: $item-gap;
  flex-wrap: wrap;
  justify-content: space-between;
  @include media(sm) {
    justify-content: center;
  }
  // 设置 卡片 样式
  @include setCardStyle(primary, false);
  // 内容区的卡片
  ::v-deep(.layout-content) {
    flex: 0 0 calc(100% / var(--pages-card-contentNum) - $item-gap);
    transition: transform var(--primary-during),
      flex var(--content-card-flex-during);
    @include media(md) {
      flex: 0 0 calc(100% / (var(--pages-card-contentNum) - 1) - $item-gap);
    }
    @include media(sm) {
      flex: 0 0 calc(100% / (var(--pages-card-contentNum) - 2) - $item-gap);
    }
    @include media(xs) {
      flex: 0 0 calc(100% / (var(--pages-card-contentNum) - 2) - $item-gap);
    }
    @include media(mi) {
      flex: unset;
      width: 100%;
    }
    // 悬浮效果
    &:hover {
      transform: translateY($translate-y);
      .poster {
        transform: scale($pages-poster-scale);
      }
    }
    &:last-child {
      margin-right: auto;
    }
    // 海报
    .poster {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--primary-during) transform;
    }
  }
}
</style>
