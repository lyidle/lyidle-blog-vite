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
        :isFixed="true"
        :pl="26"
        :pr="26"
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
            :reqComments
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
                :reqComments
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
              v-model:fromUserId="fromUserId"
              class="w-100%"
              ref="replyInstance"
            ></layout-article-comments-reply>
          </div>
        </div>
      </template>
    </div>
    <teleport to="body">
      <el-dialog
        class="primary-dialog"
        v-model="isDelete"
        width="300"
        align-center
        draggable
        @submit.prevent="deleteComment"
      >
        <el-form label-position="right" label-width="60" ref="formInstance">
          <div
            class="color-[var(--primary-color)] cur-text text-center mb-10px text-18px font-bold"
          >
            删除评论
          </div>
          <div class="color-[var(--primary-color)] cur-text text-center">
            删除评论后，评论下所有回复都会被删除,是否继续?
          </div>
          <div class="flex justify-end mt-20px">
            <my-button class="w-unset" type="default" @click="isDelete = false"
              >取消</my-button
            >
            <my-button class="w-unset" type="primary" native-type="submit">
              确认
            </my-button>
          </div>
        </el-form>
      </el-dialog>
    </teleport>
  </div>
</template>

<script setup lang="ts" name="ArticleComments">
// 引入 接口
import { delComment, getComments } from "@/api/comments"
// 引入 类型
import type { GetComments } from "@/api/comments/types/getComments"
import type { handlerReplyType, orderObjType, typeOrderMap } from "./types"
// 引入 交叉传感器
import { createIntersectionObserver } from "@/utils/observer"
import { mitt } from "@/utils/emitter"
import { handlerReqErr } from "@/utils/request/error/successError"

// 观察 ribbonInstance
const ribbonInstance = ref()
// 得到 组件的容器
const instance = ref<HTMLDivElement>()
// 暴露 实例
defineExpose({ instance })

// 回复的 id
const fromUserId = ref<number | null>(null)

// 接收并赋值 回复的user id
const handlerFromUserId = (id: number | null) => {
  fromUserId.value = id
}

// 触发 回复的   fromUserId: number | null
mitt.on("reply:userId", handlerFromUserId)
onBeforeUnmount(() => {
  mitt.off("reply:userId", handlerFromUserId)
})

let stopObserver: (() => void) | void
onBeforeUnmount(() => stopObserver?.())

onMounted(() => {
  // 使用 交叉传感器 监听 分割线
  stopObserver = createIntersectionObserver(ribbonInstance.value.instance, {
    enter: () => {
      mitt.emit("chatisEnter", false)
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
  replyInstance.value?.[0].addInstance?.instance?.textAreaInstance?.instance?.focus()
// 回复 评论的 组件实例
const repliesInstance = ref()
// 得到 子评论的 请求 函数
const reqCallbacks = () =>
  repliesInstance.value?.map((item: any) => item?.reqCommentsReplies?.())

// 分页 器
const pagination = ref<GetComments["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
})

const emit = defineEmits<{
  (e: "computedCounts", num: number): void
}>()

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
    await Promise.allSettled(reqCallbacks() || [])
  })
}

// 增加 num
const addCounts = (num: number) => {
  counts.value += num
  // 触发 父组件 得到 具体的 评论数量
  emit("computedCounts", counts.value)
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
  if (order.key === "new") {
    order.order = orderMap[order.order]
  }
  order.key = "new"
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

const isDelete = ref(false)
const deleteId = ref<null | number>(null)

// 删除 指定评论
const deleteComment = async () => {
  if (!deleteId.value) return
  try {
    await delComment(deleteId.value)
    ElMessage.success("删除评论成功")
    // 重新 获取 评论
    await reqComments()
    isDelete.value = false
  } catch (error) {
    isDelete.value = false
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("删除评论失败")
  }
}
const handlerDeleteComment = async (id: number) => {
  isDelete.value = true
  deleteId.value = id
}

// 监听 删除 指定评论
mitt.on("deleteCommentById", handlerDeleteComment)

onMounted(async () => {
  if (!props.articleId && !props.settingId) return
  await reqComments()
})

onBeforeUnmount(() => mitt.off("deleteCommentById", handlerDeleteComment))
</script>

<style lang="scss">
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
