<template>
  <!-- 添加 评论的 组件 -->
  <layout-article-comments-add
    v-bind="$attrs"
    :addComments
    :placeholder="`回复 @${fromNickName}:`"
    ref="addInstance"
  ></layout-article-comments-add>
</template>

<script setup lang="ts" name="AddArticleComments">
// 引入 类型
import type { AddCommentBody } from "@/api/comments/types/addCommentBody"
const props = defineProps<{ fromId: number; fromNickName: string }>()
// 处理 上传数据 的回调 添加 fromId
const addComments = (updateBody: AddCommentBody) => {
  if (!props.fromId) throw new Error("没有fromId，不能回复")
  updateBody.fromId = props.fromId
}

// 添加 评论的 组件实例
const addInstance = ref()

defineExpose({ addInstance })
</script>

<style scoped lang="scss"></style>
