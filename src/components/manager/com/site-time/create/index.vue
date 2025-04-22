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
        <div class="color-[var(--primary-color)]">创建网站建设进程</div>
      </template>
      <el-form
        :model="createData"
        :rules="createRules"
        label-position="left"
        label-width="60"
        ref="formInstance"
        @submit.prevent="handlerConfirm"
      >
        <el-form-item label="内容" prop="content">
          <my-input
            placeholder="内容"
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

<script setup lang="ts" name="SiteTimeCreate">
// 引入api
import { addSiteTimes } from "@/api/webInfo"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
const centerDialogVisible = ref(false)

const createData = reactive({
  content: "",
})
// 创建规则
const createRules = reactive({
  content: [
    {
      required: true,
      trigger: "change",
      message: "网站建设进程的内容是必填项",
    },
    {
      required: true,
      trigger: "change",
      min: 10,
      max: 255,
      message: "网站建设进程的内容字长度必须在10-32之间哦",
    },
  ],
})

// 初始化
const init = () => {
  centerDialogVisible.value = true
}

// 表单组件实例
const formInstance = ref()

// 关闭
const handlerClose = () => {
  formInstance.value.resetFields()
}

// 夫组件的自定义事件
const emit = defineEmits<{
  (e: "req", stay?: boolean): []
}>()

// 确认
const handlerConfirm = async () => {
  try {
    // 表单校验
    await formInstance.value.validate()
    await addSiteTimes(createData.content)
    ElMessage.success(`创建网站建设进程成功~`)
    centerDialogVisible.value = false
    // 重新请求
    emit("req", true)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("创建网站建设进程失败~")
  }
}

// 暴露
defineExpose({ init })
</script>
