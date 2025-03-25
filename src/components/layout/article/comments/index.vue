<template>
  <div class="comment-outer" style="--normal-avatar-size: 50px" ref="instance">
    <global-animations-ribbon
      class="my-20px"
      ref="ribbonInstance"
    ></global-animations-ribbon>
    <div class="comments-container">
      <div class="flex items-center gap-5px">
        <span class="text-25px">评论</span>
        <span>{{ +counts }}</span>
        <div class="flex items-center gap-3px ml-[var(--primary-gap)]">
          <div class="text-15px">
            <a
              class="comment-order !hover:color-[var(--primary-links-hover)]"
              :class="`${order.key === 'like' ? 'active' : ''}`"
              @click="handlerLike"
              >最热</a
            >
          </div>
          <div class="text-15px">|</div>
          <div class="text-15px">
            <a
              class="comment-order !hover:color-[var(--primary-links-hover)]"
              @click="handlerNewOrder"
              :class="`${order.key === 'new' ? 'active' : ''}`"
              >{{ order.order === "desc" ? "最新" : "最晚" }}</a
            >
          </div>
        </div>
      </div>
      <!-- 增加 评论的 组件 -->
      <layout-article-comments-add
        :articleId
        :settingId
        :reqComments
      ></layout-article-comments-add>
    </div>

    <div class="comments-content mb-20px comment-data" v-if="pagination.total">
      <template v-for="comment in comments" :key="comment.id">
        <div class="comment-item" v-if="comment.id">
          <!-- 评论信息 -->
          <layout-article-comments-item
            @reply="handlerReply"
            :comment
            :articleId
            :settingId
            :parentId="null"
            avatarSize="var(--normal-avatar-size)"
            v-bind="$attrs"
          ></layout-article-comments-item>
          <!-- 评论的回复信息 -->
          <div
            class="flex flex-col gap-[var(--primary-gap)] mt-[var(--primary-gap)]"
          >
            <div class="flex justify-between">
              <div class="h-100% w-70px"></div>
              <layout-article-comments-reply-item
                @reply="handlerReply"
                @counts="addCounts"
                :parentId="comment.id"
                :articleId
                :settingId
                :orderMap
                ref="repliesInstance"
                v-model:order="order"
                v-bind="$attrs"
              ></layout-article-comments-reply-item>
            </div>
          </div>
        </div>
        <div class="flex justify-between" v-if="comment.id">
          <div class="h-100% w-70px"></div>
          <div class="w-100%">
            <!-- 回复 框 -->
            <layout-article-comments-reply
              v-if="comment.isShowComment"
              :fromId="fromId"
              :parentId="comment.id"
              :articleId
              :settingId
              :reqComments
              :fromNickName
              class="w-100%"
              ref="replyInstance"
            ></layout-article-comments-reply>
          </div>
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
import type { handlerReplyType, orderObjType, typeOrderMap } from "./types"
// 引入 交叉传感器
import { createIntersectionObserver } from "@/utils/observer"
import { mitt } from "@/utils/emitter"

// 观察 ribbonInstance
const ribbonInstance = ref()
// 得到 组件的容器
const instance = ref<HTMLDivElement>()
onMounted(() => {
  // 使用 交叉传感器 监听 分割线
  createIntersectionObserver(ribbonInstance.value.instance, {
    enter: () => {
      mitt.emit("chatisEnter", { isEnter: false })
    },
    leave: (entry) => {
      // 限制判断
      if (entry.boundingClientRect.top > 0) return
      const rect = instance.value?.getBoundingClientRect()
      mitt.emit("chatisEnter", { isEnter: true, rect })
    },
  })
})

const props = defineProps<{ articleId?: number; settingId?: number }>()
// 评论 数量
const counts = ref(0)
// 保存的 评论
const comments = ref<GetComments["data"]["comments"]>()
// 回复 的评论 id
const fromId = ref(-1)
// 回复 的评论 nickName
const fromNickName = ref("")
// 回复评论输入 的 组件的 实例
const replyInstance = ref()
// 回复 回复评论输入聚焦函数
const focusCallback = () =>
  replyInstance.value?.[0].addInstance?.textAreaInstance?.instance?.focus()
// 回复 评论的 组件实例
const repliesInstance = ref()
// 得到 子评论的 请求 函数
const reqCallbacks = () =>
  repliesInstance.value?.map((item: any) => item?.reqCommentsReplies())

// 分页 器
const pagination = ref<GetComments["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

// 得到 评论
const reqComments = async () => {
  // 每次请求时 重置 次数
  counts.value = 0
  // 得到 id 判断 是否有 articleId settingId  没有则 退出
  const id = props.articleId || props.settingId
  // 验证 信息
  if (!id) {
    console.error("评论区加载失败，没有id")
    return ElMessage.warning("评论区加载失败，没有id")
  }
  if (props.articleId && props.settingId) {
    console.error("评论区加载失败，id冲突")
    return ElMessage.warning("评论区加载失败，id冲突")
  }

  // 获取 评论数据
  const result = await getComments({
    articleId: props.articleId ? `${props.articleId}` : "",
    settingId: props.settingId ? `${props.settingId}` : "",
    key: order.key,
    order: order.order,
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
  })

  // 赋值 评论数据
  const { comments: _comments, pagination: _pagination } = result
  comments.value = _comments
  pagination.value = _pagination
  counts.value = _pagination.total!
  // 处理 子组件的数据
  nextTick(async () => {
    // 使用 allSettled 获取 子组件对应的 回复数据
    await Promise.allSettled(reqCallbacks())
  })
}

// 增加 num
const addCounts = (num: number) => {
  counts.value += num
}

// 构建 相反的 order 映射
const orderMap: typeOrderMap = {
  desc: "asc",
  asc: "desc",
}

// 评论排序
const order = reactive<orderObjType>({
  order: "desc",
  key: "like",
})

// 评论下方的 按钮
// 最新 和 最晚 的 排序 按钮
const handlerNewOrder = async () => {
  if (!comments.value) return
  order.key = "new"

  if (order.key !== "new") order.order = orderMap[order.order]
  await reqComments()
}
// 处理 按照 点赞排序
const handlerLike = async () => {
  if (!comments.value || (order.key === "like" && order.order === "desc"))
    return
  order.key = "like"
  order.order = "desc"
  await reqComments()
}

// 回复 按钮 用户打开 回复框
const handlerReply = (options: handlerReplyType) => {
  const {
    showId: _showId,
    fromId: _fromId,
    fromNickName: _fromNickName,
  } = options

  // 先全部关上 isShowComment
  comments.value?.forEach((item) => {
    item.isShowComment = false
  })

  // 修改 对应的 配置
  fromId.value = _fromId
  fromNickName.value = _fromNickName

  // 修改 showId 的 isShowComment 显示
  const find = comments.value?.find((item) => item.id === _showId)
  if (!find) return
  // 找到 修改 相关信息
  find.isShowComment = true
  nextTick(() => focusCallback?.())
}

onMounted(async () => {
  if (!props.articleId && !props.settingId) return
  await reqComments()
})
</script>

<style lang="scss">
%vditor-style {
  // 改变 vditor 的样式
  .vditor-style {
    padding: var(--primary-pd);
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
    img {
      max-width: 500px;
      display: block;
      $m: 15px;
      margin-top: $m;
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
  --primary-pd: 10px;
  .comments-container {
    padding: $container-pd;
    @extend %vditor-style;
    // 排序 按钮
    .comment-order {
      &.active {
        color: rgb(219, 127, 127);
      }
    }
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
