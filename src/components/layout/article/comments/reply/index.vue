<template>
  <!-- 添加 评论的 组件 -->
  <layout-article-comments-add
    :addComments
    :placeholder="`回复 @${fromNickName}:`"
    btnName="回复"
    ref="addInstance"
    v-bind="$attrs"
  ></layout-article-comments-add>
</template>

<script setup lang="ts" name="AddArticleComments">
// 引入 类型
import type { AddCommentBody } from "@/api/comments/types/addCommentBody"
const props = defineProps<{
  fromId: number
  parentId: number
  fromNickName: string
}>()

// 回复的 id
const fromUserId = defineModel<number | null>("fromUserId")

// 处理 上传数据 的回调 添加 fromId
const addComments = (data: AddCommentBody) => {
  if (!props.fromId) throw new Error("没有fromId，不能回复")
  data.fromId = props.fromId
  data.parentId = props.parentId
  data.fromUserId = fromUserId.value
}
// 得到 添加组件的 实例
const addInstance = ref()
// 暴露对应信息
defineExpose({ addInstance })
</script>

<style scoped lang="scss"></style>
