<template>
  <div class="comment-outer">
    <global-animations-ribbon class="my-20px"></global-animations-ribbon>
    <div class="comments-container">
      <div class="flex items-center gap-5px">
        <span class="text-25px">评论</span>
        <span>{{ +counts }}</span>
        <div class="flex items-center gap-3px ml-[var(--primary-gap)]">
          <div class="text-15px">
            <a class="hover:color-[var(--primary-links-hover)]">最热</a>
          </div>
          <div class="text-15px">|</div>
          <div class="text-15px">
            <a
              class="hover:color-[var(--primary-links-hover)]"
              @click="handlerNewOrder"
              >{{ order.new.order === "desc" ? "最新" : "最晚" }}</a
            >
          </div>
        </div>
      </div>
      <!-- 增加 评论的 组件 -->
      <layout-article-comments-add
        v-if="articleId"
        :articleId
        :reqComments
      ></layout-article-comments-add>
    </div>
    <div class="comments-content mb-20px comment-data">
      <template v-for="comment in comments" :key="comment.id">
        <div class="comment-item" v-if="comment.id">
          <!-- 评论信息 -->
          <layout-article-comments-item
            @reply="handlerReply"
            :comment
          ></layout-article-comments-item>
          <!-- 评论的回复信息 -->
          <div
            class="flex flex-col gap-[var(--primary-gap)] mt-[var(--primary-gap)]"
          >
            <template v-for="replies in comment.replies" :key="replies.id">
              <div class="flex justify-between" v-if="replies.id">
                <div class="h-100% w-70px"></div>
                <layout-article-comments-item
                  @reply="handlerReply"
                  :comment="replies"
                  class="w-100%"
                ></layout-article-comments-item>
              </div>
            </template>
          </div>
        </div>
        <div class="flex justify-between" v-if="comment.id">
          <div class="h-100% w-70px"></div>
          <!-- 回复 框 -->
          <layout-article-comments-reply
            v-if="comment.isShowComment"
            :fromId="fromId"
            :articleId
            :reqComments
            :fromNickName
            class="w-100%"
            ref="replyInstance"
          ></layout-article-comments-reply>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts" name="ArticleComments">
// 引入 接口
import { getComments } from "@/api/comments"
// 引入 类型
import type { GetComments } from "@/api/comments/types/getComments"
import type { handlerReplyType, OrderKeys, orderObjType } from "./types"
const props = defineProps<{ articleId: number }>()
// 评论 数量
const counts = ref(0)
// 保存的 评论
const comments = ref<GetComments["data"]>()
// 回复 的评论 id
const fromId = ref(-1)
// 回复 的评论 nickName
const fromNickName = ref("")
// 回复 框的 组件实例
const replyInstance = ref()
// 计算得到 对应显示的 textArea实例
const textAreaInstance = computed(() => {
  if (replyInstance?.value?.length)
    for (const instances of replyInstance?.value) {
      return instances?.addInstance?.textAreaInstance?.instance?.focus
    }
})
// 得到 评论
const reqComments = async () => {
  const id = props.articleId
  if (!props.articleId) return
  const result = await getComments(id)
  // 处理 评论 个数
  handlerCounts(result)
  result?.forEach?.((item) => {
    const parentId = item.id
    if (item?.replies?.length) {
      // 添加一个 parentId
      item.replies.forEach((item) => (item.parentId = parentId))
    }
  })
  comments.value = orderComments(result)
}

// 处理 评论数量的 函数
const handlerCounts = (comments: GetComments["data"]) => {
  // 初始化 外层的 个数
  let len = comments?.length || 0
  if (len) {
    // 初始化回复的 个数
    for (const value of comments) {
      const curLen = value.replies?.length
      // 存在 则相加
      if (curLen) len += curLen
    }
  }
  if (len) counts.value = len
}

// 构建 相反的 order 映射
const orderMap = {
  desc: "asc",
  asc: "desc",
} as const

// 评论排序
const order = reactive<orderObjType>({
  like: {
    order: "desc",
    key: "updatedAt",
  },
  new: {
    order: "desc",
    key: "updatedAt",
  },
})

// 评论排序 的回调函数
const orderComments = (
  comments: GetComments["data"],
  key: OrderKeys = "new"
): GetComments["data"] => {
  // 得到 当前 的排序
  const curOrder = order[key]
  return comments.sort((a, b) => {
    const dateA = new Date(a[curOrder.key]).getTime()
    const dateB = new Date(b[curOrder.key]).getTime()
    if (curOrder.order === "asc") {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })
}

// 评论下方的 按钮
// 最新 和 最晚 的 排序 按钮
const handlerNewOrder = () => {
  if (!comments.value) return
  order.new.order = orderMap[order.new.order]
  orderComments(comments.value, "new")
}

// 回复 按钮 用户打开 回复框
const handlerReply = (options: handlerReplyType) => {
  const {
    showId: _showId,
    fromId: _fromId,
    fromNickName: _fromNickName,
    callback,
  } = options
  // 先全部关上 isShowComment
  comments.value?.forEach((item) => {
    item.isShowComment = false
  })
  // 修改 对应的 配置
  fromId.value = _fromId
  fromNickName.value = _fromNickName

  // 修改 showId 的 isShowComment 显示
  const find = comments.value?.find((item) => {
    // 查找 顶层评论
    if (item.id === _showId) return true
    // 查找 回复
    if (item?.replies?.length)
      return item.replies.find((_item) => _item.id === _showId)
  })
  // 找到 修改 相关信息
  if (find) {
    find.isShowComment = true
    callback?.()
    nextTick(() => textAreaInstance.value?.())
  }
}

onMounted(async () => {
  if (!props.articleId) return
  await reqComments()
})
</script>

<style lang="scss">
%vditor-style {
  // 改变 vditor 的样式
  .vditor-style {
    padding: 10px;
    border: 1px solid var(--primary-scend-color);
    cursor: var(--cursor-default);
    min-height: 30px;
    p,
    a {
      @extend %text-cursor;
    }
    @for $i from 1 through 6 {
      h#{$i} {
        @extend %text-cursor;
      }
    }

    // 隐藏 描点后的 跳转
    a[id^="vditorAnchor"] {
      svg {
        display: none;
      }
    }
  }
}
// 容器的 padding
$container-pd: 0 26px;
.comment-outer {
  --primary-gap: 10px;
  .comments-container {
    padding: $container-pd;
    @extend %vditor-style;
  }

  .comments-content {
    padding: $container-pd;
    display: flex;
    gap: var(--primary-gap);
    flex-direction: column;
  }
  .comment-data {
    @extend %vditor-style;
  }
}
</style>
