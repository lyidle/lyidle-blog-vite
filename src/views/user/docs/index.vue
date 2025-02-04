<template>
  <layout-content>
    <template #content-start>
      <my-card class="card_style allDocs cur-text">
        <!-- 头部 文章总览 -->
        <div class="flex justify-between">
          <div class="text-[30px] font-bold">文章总览 - {{ showPages }}</div>
          <div>{{ showAccount }}</div>
        </div>
        <div v-for="item in docs" :key="item.id">
          {{ moment(item.updatedAt) }}
        </div>
        <hr />
        {{ docs }}
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="FindAllUserPages">
// 引入 仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 引入 hooks
import { useShowUserinfo } from "@/hooks/showUserinfo"
// 引入 utils
import { orderArticle } from "@/utils/doc/orderArticle"
// 引入 moment
import moment from "@/utils/moment"
// 提取相关信息
const { userDocs, userToken } = storeToRefs(useUserStore())
const { adminDocs } = storeToRefs(useOwnerStore())
// 得到 文章信息
const docs = computed(() => {
  if (userToken.value) {
    return orderArticle(userDocs.value, true)
  }
  return orderArticle(adminDocs.value, true)
})
// 使用 hooks
const { showAccount, showPages } = useShowUserinfo({
  showAccount: true,
  showPages: true,
})
// 使用 路由 hook
const route = useRoute()
</script>

<style scoped lang="scss">
// 设置 卡片 阴影
@include setCardShadow;
.allDocs {
  padding: 40px;
}
</style>
