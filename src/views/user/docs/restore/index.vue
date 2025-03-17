<template>
  <layout-article-tree :account :title="$route.meta.title || '文章回收站'">
    <template #btns="{ row }">
      <!-- 删除 -->
      <my-popconfirm
        width="220"
        :title="`确认要恢复《${row.title}》么?`"
        icon-color="#F56C6C"
        placement="top"
        @confirm="restoreArticle(row.id)"
      >
        <template #reference>
          <my-button
            class="w-80px"
            size="small"
            v-author="{ author: row.author }"
            >恢复文章</my-button
          >
        </template>
        <template #actions="{ confirm, cancel }">
          <my-button class="w-unset" type="default" size="small" @click="cancel"
            >否</my-button
          >
          <my-button
            class="w-unset"
            type="danger"
            size="small"
            @click="confirm"
          >
            是
          </my-button>
        </template>
      </my-popconfirm>
    </template>
  </layout-article-tree>
</template>

<script setup lang="ts" name="FindAllUserPagesRestore">
// 引入 api
import { recoverArticle, searchArticleMergeExact } from "@/api/article"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { mitt } from "@/utils/emitter"
import { handlerReqErr } from "@/utils/request/error/successError"
// 提取需要的数据
const { userAccount } = storeToRefs(useUserStore())

// 使用 路由 hook
const route = useRoute()
// 得到作者
const account = route.params.author as string

// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  try {
    const result = await searchArticleMergeExact({
      author: account,
      currentPage,
      pageSize,
      restore: "true",
    })
    return result
  } catch (error) {}
}
// 恢复文章的回调
const restoreArticle = async (id: string | number) => {
  try {
    await recoverArticle(id)
    // 获取所有文章
    await handlerArticles()
    ElMessage.success(`恢复文章成功~`)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("恢复文章失败~")
    // 获取所有文章
    await handlerArticles()
  }
}
onMounted(() => {
  // 账号和本地的不一样
  if (userAccount.value !== account) {
    mitt.emit("account inconsistent", "无权限访问当前文章回收站~")
    return
  }
})
// 提供方法
provide("req", handlerArticles)
</script>

<style scoped lang="scss"></style>
