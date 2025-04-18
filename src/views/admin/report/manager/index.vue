<template>
  <div class="admin-container">
    <my-search-admin
      :submit="handlerSearch"
      label="目标id"
      :reset="handlerReset"
      placeholder="请输入目标id"
      class="!overflow-unset"
    >
      <div class="flex gap-10px items-center">
        <span class="cur-text" :style="{ fontSize: isSmall ? '13px' : '16px' }"
          >举报的类型:</span
        >
        <my-select
          v-model="types"
          :options="typeOptions"
          @change="reloadReq"
          class="w-100px"
          :size="isSmall ? 'small' : 'default'"
        ></my-select>
      </div>
    </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          type="danger"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          @click="handlerAllDelete"
          >批量删除</my-button
        >
      </div>
      <my-table
        :data="tableData"
        style="width: 100%"
        height="46vh"
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
      >
        <my-table-column type="selection" width="30" />
        <my-table-column width="40" prop="id" label="id" align="center" />
        <my-table-column
          :width="tablePrimaryColumWidth"
          prop="desc"
          label="描述"
          align="center"
        />
        <my-table-column
          :width="tablePrimaryColumWidth"
          prop="filterType"
          label="分类"
          align="center"
        />
        <my-table-column label="目标id" align="center">
          <template #="{ row }">
            {{ showTargetId(row) }}
          </template>
        </my-table-column>
        <my-table-column
          min-width="100"
          prop="createdAt"
          label="创建时间"
          align="center"
        >
          <template #="{ row }">
            {{ moment(row.createdAt, "YYYY-MM-DD LTS") }}
          </template>
        </my-table-column>
        <my-table-column
          min-width="100"
          prop="updatedAt"
          label="更新时间"
          align="center"
        >
          <template #="{ row }">
            {{ moment(row.createdAt, "YYYY-MM-DD LTS") }}
          </template>
        </my-table-column>
        <!-- 工具栏 -->
        <my-table-column
          :width="toolBtnsWidth"
          fixed="right"
          label="工具栏"
          align="center"
        >
          <template #="{ row }">
            <div class="flex gap-10px flex-wrap justify-center">
              <el-button
                size="small"
                class="!m-0"
                :style="{ width: isSmall ? '80px' : '70px' }"
                type="primary"
                plain
                @click="viewData(row)"
                >来源</el-button
              >
              <my-button
                size="small"
                class="!m-0"
                :style="{ width: isSmall ? '80px' : '70px' }"
                @click="sendInit(row)"
                >系统通知</my-button
              >
              <my-button
                size="small"
                class="!m-0"
                :style="{ width: isSmall ? '80px' : '70px' }"
                type="warning"
                @click="sendBackInit(row)"
                >反馈通知</my-button
              >
              <!-- 删除 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要删除id为:${row.id}的举报信息么?`"
                placement="top"
                @confirm="handlerDelete(row)"
              >
                <template #reference>
                  <my-button
                    class="!m-0"
                    :style="{ width: isSmall ? '80px' : '70px' }"
                    size="small"
                    type="danger"
                    >删除</my-button
                  >
                </template>
                <template #actions="{ confirm, cancel }">
                  <my-button
                    type="default"
                    class="w-unset"
                    size="small"
                    @click="cancel"
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
              <!-- 删除目标文件信息 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要删除id为:${showTargetId(row)}的${handlerType(
                  row
                )}么?`"
                placement="top"
                @confirm="handlerDeleteTarget(row)"
                v-if="handlerType(row) !== '用户'"
              >
                <template #reference>
                  <my-button
                    size="small"
                    class="!m-0"
                    :style="{ width: isSmall ? '80px' : '70px' }"
                    type="danger"
                    plain
                    >删除{{ handlerType(row) }}</my-button
                  >
                </template>
                <template #actions="{ confirm, cancel }">
                  <my-button
                    type="default"
                    class="w-unset"
                    size="small"
                    @click="cancel"
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
              <!-- 修改目标用户 -->
              <my-button
                v-else
                size="small"
                class="!m-0"
                :style="{ width: isSmall ? '80px' : '70px' }"
                type="warning"
                @click="userEditor.init(row.targetUserId)"
                >修改{{ handlerType(row) }}</my-button
              >
            </div>
          </template>
        </my-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <my-empty />
          </div>
        </template>
      </my-table>
      <my-pagination
        v-if="pagination?.total"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="pagination.total"
        :page-sizes="[10, 20, 30]"
        @change="reqReports"
        @current-change="handlerCurrentPage"
        @size-change="handlerSizeChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        :dark="true"
        class="justify-center mt-[var(--admin-content-item-gap)]"
      />

      <manager-com-msg-send ref="send" @req="handlerReq" @send="sendMsg" />
      <manager-com-msg-send
        ref="feedback"
        @req="handlerReq"
        @send="sendMsgBack"
      />

      <teleport to="body">
        <el-dialog
          class="primary-dialog admin-dialog-preview"
          v-model="viewDialog"
          align-center
          draggable
          @close="initView"
        >
          <h2 class="m-0 text-center color-[var(--primary-color)] cur-text">
            预览信息{{ showTitle }}
          </h2>
          <!-- 预览用户 -->
          <div
            v-if="showUser && userId"
            class="w-500px mt-20px flex justify-center mb-5px"
          >
            <global-userinfo :userId="userId" class="w-400px"></global-userinfo>
          </div>
          <!-- 预览文章 -->
          <div
            v-if="content"
            class="content mt-20px flex justify-center mb-5px"
          >
            <!-- 预览文章 -->
            <vditor-preview
              v-model:article="content"
              :isExportHtml="false"
              :autoPreview="false"
              v-if="articleId"
            ></vditor-preview>
            <!-- 预览评论 -->
            <vditor-preview
              v-model:article="content"
              :isExportHtml="false"
              :autoPreview="false"
              v-if="commentId"
            ></vditor-preview>
            <!-- 预览消息 -->
            <vditor-preview
              v-model:article="content"
              :isExportHtml="false"
              :autoPreview="false"
              v-if="msgId"
            ></vditor-preview>
          </div>
        </el-dialog>
      </teleport>
      <manager-com-report-user-editor
        ref="userEditor"
      ></manager-com-report-user-editor>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminReportManager">
import moment from "@/utils/moment"
// 引入 hooks
import { useManagerReportBase } from "@/hooks/manager/report/manager/useManagerReportBase"
// 引入 接口api
import { delReports } from "@/api/admin/report"
// 引入 类型
import { GetReports } from "@/api/admin/report/types/getReports"
import { SentSystemMsg } from "@/api/admin/sysMsg/types/sentSystemMsg"
import { mitt } from "@/utils/emitter"
import { getOneArticle, managerDeleteArticle } from "@/api/article"
import { getCommentByPk, managerDelComment } from "@/api/comments"
import { decompressStringNotError } from "@/utils/compression"
import { handlerReqErr } from "@/utils/request/error/successError"
import { getMsgByPk, managerDelMsg } from "@/api/user/msg"
// 表格的信息 和 搜索
const {
  tableData,
  pagination,
  handleSelectionChange,
  reqReports,
  reportsId,
  headerBtnsSize,
  currentPage,
  pageSize,

  tablePrimaryColumWidth,
  toolBtnsWidth,
  isSmall,

  // 多选框
  types,
  typeOptions,

  // 搜索
  handlerSearch,
  handlerReset,
  searchKey,
} = useManagerReportBase()

// 多选框变化时
const reloadReq = async () => {
  searchKey.value = ""
  currentPage.value = 0
  await reqReports()
}

// 个数变化
const handlerSizeChange = (num: number) => {
  pageSize.value = num
}

// 页数变化
const handlerCurrentPage = (num: number) => {
  currentPage.value = num
}
type listType = GetReports["data"]["list"][0]
// 子组件
// 系统通知
const send = ref()
// 举报结果的反馈 通知
const feedback = ref()
const userEditor = ref()

// 处理类型
const handlerType = (row: listType) => {
  let type = "未知"
  if (row.targetType === "article") type = "文章"
  if (row.targetType === "comment") type = "评论"
  if (row.targetType === "msg") type = "消息"
  if (row.targetType === "user") type = "用户"
  return type
}

// 初始化系统消息的提示信息 系统通知
const sendInit = (row: listType) => {
  let type = handlerType(row)
  let targetId = 0
  // 中间的 提示信息
  let tip = `现已删除此${type}`
  if (row.targetType === "user") {
    type = "用户"
    tip = "现以修改违规的地方"
    targetId = row.userId || 0
  }

  if (row.targetType === "article") targetId = row.articleId || 0
  if (row.targetType === "comment") targetId = row.commentId || 0
  if (row.targetType === "msg") targetId = row.msgId || 0

  send.value?.init(row, {
    title: `${type}违规处理通知`,
    content: `你好，你的${type}[${row.targetType}:${targetId}]存在违规情况，涉及:${row.filterType}，详情：${row.desc}，${tip}，感谢您的理解~~`,
  })
}

// 处理发送消息的格式 系统通知
const sendMsg = ({ msg, row }: { msg: SentSystemMsg; row: listType }) => {
  msg.isAll = false
  // 被举报者
  msg.userId = row.targetUserId
}
let targetId = 0
// 初始化系统消息的提示信息 举报结果的反馈 通知
const sendBackInit = (row: listType) => {
  let type = handlerType(row)
  if (row.targetType === "user") {
    type = "用户"
    targetId = row.userId || 0
  }
  if (row.targetType === "article") targetId = row.articleId || 0
  if (row.targetType === "comment") targetId = row.commentId || 0
  if (row.targetType === "msg") targetId = row.msgId || 0

  feedback.value?.init(row, {
    title: `${type}举报处理通知`,
    content: `你好，根据审核您举报的${type}[${row.targetType}:${targetId}]，暂未发现其存在违规情况，我们将持续关注该${type}，的后续情况，一经核实，将从严处理。感谢您的举报，帮助我们维护一个良好又安全的社区氛围~~`,
  })
}
// 处理发送消息的格式 举报结果的反馈 通知
const sendMsgBack = ({ msg, row }: { msg: SentSystemMsg; row: listType }) => {
  msg.isAll = false
  // 举报者
  msg.userId = row.userId
}

// 删除目标文件来源
const handlerDeleteTarget = async (row: listType) => {
  const type = row.targetType
  let access = false
  // 删除文章
  if (type === "article") {
    if (!row.articleId) return ElMessage.warning("没有articleId")
    try {
      await managerDeleteArticle(row.articleId)
      ElMessage.success("删除文章成功")
      access = true
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("删除文章失败")
    }
  }
  // 删除评论
  if (type === "comment") {
    if (!row.commentId) return ElMessage.warning("没有commentId")
    try {
      await managerDelComment(row.commentId)
      ElMessage.success("删除评论成功")
      access = true
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("删除评论失败")
    }
  }
  // 删除消息
  if (type === "msg") {
    if (!row.msgId) return ElMessage.warning("没有msgId")
    try {
      await managerDelMsg(row.msgId)
      ElMessage.success("删除消息成功")
      access = true
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("删除消息失败")
    }
  }
  if (access) await handlerReq()
}

const viewDialog = ref(false)
// 预览用户
const showUser = ref<boolean>()
const userId = ref<number>()
// 预览文章
const articleId = ref<number>()
// 文章的内容
const content = ref()
// 评论
const commentId = ref<number>()
// 消息
const msgId = ref<number>()
// 得到 内容
watchEffect(async () => {
  // 文章
  const artId = articleId.value
  // 评论
  const commenId = commentId.value
  // 消息
  const _msgId = msgId.value
  // 文章
  if (artId) {
    const result = await getOneArticle(artId)
    content.value = { content: decompressStringNotError(result?.content || "") }
  }
  // 评论
  if (commenId) {
    const result = await getCommentByPk(commenId)
    content.value = { content: decompressStringNotError(result.content || "") }
  }
  // 消息
  if (_msgId) {
    const result = await getMsgByPk(_msgId)
    content.value = { content: decompressStringNotError(result.content || "") }
  }
})
// 初始化 数据
const initView = () => {
  // 内容显示
  content.value = undefined
  // 用户
  showUser.value = false
  userId.value = undefined
  // 文章
  articleId.value = undefined
  // 评论
  commentId.value = undefined
  // 消息
  msgId.value = undefined
}
const showTitle = computed(() => {
  if (showUser.value) return "用户"
  if (articleId.value) return "文章"
  if (commentId.value) return "评论"
  if (msgId.value) return "消息"
  return "未知"
})

const viewData = (row: listType) => {
  const type = row.targetType
  // 初始化 数据
  initView()
  if (type === "user") {
    showUser.value = true
    userId.value = row.targetUserId
  }

  if (type === "article") {
    articleId.value = row.articleId || undefined
  }
  if (type === "comment") {
    commentId.value = row.commentId || undefined
  }

  if (type === "msg") {
    msgId.value = row.msgId || undefined
  }

  // 显示对话框
  viewDialog.value = true
}

// 显示 目标id的函数
const showTargetId = (row: listType) => {
  if (row.targetType === "user") return row.targetUserId
  if (row.targetType === "article") return row.articleId
  if (row.targetType === "comment") return row.commentId
  if (row.targetType === "msg") return row.msgId
  return "未知分类的id"
}

// 请求的逻辑
const handlerReq = async (stay?: boolean) => {
  // 当前页
  const cur = currentPage.value
  // 上一页
  const pre = cur - 1 <= 0 ? 1 : cur - 1
  if (stay) {
    // 默认是 当前页 和分页器的个数
    await reqReports(cur, pageSize.value)
    return
  }
  // 只有一条数据时
  if (pagination.value?.total === 1) {
    // 清除 table数据
    tableData.value = []
    return
  }
  // 只有一个的情况
  if (tableData.value.length === 1) {
    // 跳到上一页
    await reqReports(pre, pageSize.value)
    return
  }
  // 处理批量删除时的逻辑
  const len = reportsId.value?.length
  // 删除时选择的个数和页码个数大于等于 则是上一页
  if (len >= pageSize.value) {
    // 跳到上一页
    await reqReports(cur - 1, pageSize.value)
    return
  }
  // 默认是 当前页 和分页器的个数
  await reqReports(cur, pageSize.value)
  // 重新加载路由
  mitt.emit("route:reload")
}

// 删除
const handlerDelete = async (row: listType) => {
  const { id } = row
  try {
    // 删除
    await delReports(id)
    // 重新请求
    await handlerReq()
    ElMessage.success(`删除id为:${id}的举报信息成功~`)
  } catch (error) {
    ElMessage.error(`删除id为:${id}的举报信息失败~`)
  }
}

// 批量删除
const handlerAllDelete = async () => {
  if (!reportsId.value?.length)
    return ElMessage.warning("没有需要删除的举报信息")
  try {
    await Promise.all(
      reportsId.value.map(async (item) => {
        try {
          // 删除
          await delReports(item)
        } catch (error) {
          ElMessage.error(`批量删除时,id:${item}删除失败~`)
        }
      })
    )
    // 重新请求
    if (pagination.value?.total === 1) await reqReports()
    else await handlerReq()
    ElMessage.success(`批量删除成功,已成功删除~`)
  } catch (error) {
    // 重新请求
    if (pagination.value?.total === 1) await reqReports()
    else await handlerReq()
    ElMessage.error(`批量删除失败~`)
  }
}
</script>

<style lang="scss">
.admin-dialog-preview {
  width: fit-content;
  max-height: 90vh;
  overflow: hidden;
  .content {
    width: 80vw;
    max-height: 70vh;
    overflow-y: auto;
    .vditor-reset {
      img {
        max-width: 100%;
        display: block;
      }
    }
  }
}
</style>
