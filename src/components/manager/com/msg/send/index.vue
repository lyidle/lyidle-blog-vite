<template>
  <teleport to="body">
    <el-dialog
      class="primary-dialog sentMsg"
      v-model="centerDialogVisible"
      width="500"
      align-center
      draggable
      @close="handlerClose"
    >
      <template #header>
        <div class="color-[var(--primary-color)]">发送系统消息</div>
      </template>
      <el-form
        :model="createData"
        :rules="createRules"
        label-position="right"
        label-width="60"
        ref="formInstance"
        @submit.prevent="handlerConfirm"
      >
        <el-form-item label="标题" prop="title">
          <my-input placeholder="标题" v-model="createData.title"></my-input>
        </el-form-item>
        <el-form-item label="消息" prop="content" class="mt-20px">
          <my-input
            placeholder="消息"
            v-model="createData.content"
            type="textarea"
            class="mx-10px"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></my-input>
        </el-form-item>
        <div class="flex justify-end mt-20px">
          <my-button
            class="w-unset"
            type="default"
            @click="centerDialogVisible = false"
            >取消</my-button
          >
          <my-button class="w-unset" type="primary" native-type="submit">
            确认
          </my-button>
        </div>
      </el-form>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts" name="SystemMessageSend">
// 引入api
import { sendSystemMsg } from "@/api/admin/sysMsg"
import { SentSystemMsg } from "@/api/admin/sysMsg/types/sentSystemMsg"
// 引入 类型
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
const centerDialogVisible = ref(false)

const createData = reactive({
  content: "",
  title: "",
  userId: -1,
})
// 创建规则
const createRules = reactive({
  content: [
    { required: true, trigger: "change", message: "消息是必填项" },
    {
      required: true,
      trigger: "change",
      min: 10,
      max: 255,
      message: "消息字长度必须在10-32之间哦",
    },
  ],
  title: [
    { required: true, trigger: "change", message: "消息标题是必填项" },
    {
      required: true,
      trigger: "change",
      min: 1,
      max: 50,
      message: "消息标题字长度必须在1-50之间哦",
    },
  ],
})

const row = ref<any>()

// 初始化
const init = (_row: any, opt?: { title?: string; content?: string }) => {
  centerDialogVisible.value = true
  row.value = _row
  createData.title = opt?.title || ""
  createData.content = opt?.content || ""
}

// 表单组件实例
const formInstance = ref()

// 关闭
const handlerClose = () => {
  formInstance.value.resetFields()
  row.value = {}
}

// 夫组件的自定义事件
const emit = defineEmits<{
  (e: "req", stay?: boolean): []
  (e: "send", data: { msg: SentSystemMsg; row: any }): void
  (e: "sucSend", data: any): void
}>()

const props = defineProps<{ isSucSend?: boolean }>()

// 确认
const handlerConfirm = async () => {
  try {
    // 表单校验
    await formInstance.value.validate()
    const systemMsg: SentSystemMsg = {
      content: createData.content,
      isAll: true,
      title: createData.title,
    }
    emit("send", { msg: systemMsg, row: row.value })
    await sendSystemMsg(systemMsg)
    ElMessage.success(`发送消息成功~`)
    const options = {
      isStay: true,
    }

    if (props.isSucSend)
      await new Promise((resolve, reject) => {
        emit("sucSend", { row: row.value, options, resolve, reject })
      })

    centerDialogVisible.value = false

    // 重新请求
    emit("req", options.isStay)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("发送消息失败~")
  }
}

// 暴露
defineExpose({ init })
</script>

<style lang="scss">
.primary-dialog {
  &.sentMsg {
    textarea {
      &::placeholder {
        color: var(--primary-color);
      }
      border: unset;
      box-shadow: unset;
      border: 1px solid var(--primary-input-underline-bg);
      padding: 5px;
    }
  }
}
</style>
