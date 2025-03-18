<template>
  <teleport to="body">
    <el-dialog
      class="manager-dialog"
      v-model="centerDialogVisible"
      width="500"
      align-center
      draggable
      @close="handlerClose"
    >
      <template #header>
        <div class="color-[var(--primary-color)]">创建设置</div>
      </template>
      <el-form
        :model="createData"
        :rules="createRules"
        label-position="right"
        label-width="70"
        ref="formInstance"
        @submit.prevent="handlerConfirm"
      >
        <el-form-item label="设置名" prop="name">
          <my-input
            placeholder="请输入设置名"
            v-model="createData.name"
          ></my-input>
        </el-form-item>
        <my-select
          v-model="contentType"
          :options="contentTypeOptions"
          class="w-70px float-right"
        ></my-select>
        <el-form-item label="内容" prop="content">
          <template v-if="createData.name !== '关于'">
            <!-- 字符串 -->
            <my-input
              v-if="contentType === 'string'"
              placeholder="请输入内容"
              v-model="createData.content"
              type="textarea"
              class="mx-10px"
              :autosize="{ minRows: 2, maxRows: 10 }"
            ></my-input>
            <!-- 对象字面量型 -->
            <my-input
              v-if="contentType === 'object'"
              placeholder="请输入内容"
              v-model="createData.content"
              type="textarea"
              class="mx-10px"
              :autosize="{ minRows: 2, maxRows: 10 }"
            ></my-input>

            <!-- array 类型 -->
            <my-tags
              v-if="contentType === 'array'"
              v-model="createData.arrayContent"
              min="1"
              max="5"
              error="标签个数需要在1-5之间"
              ref="tagsInstance"
              class="mr-10px"
              left="10px"
            ></my-tags>
          </template>
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

<script setup lang="ts" name="SettingCreate">
// 引入 接口
import { createSetting } from "@/api/admin"
// 引入 类型
import type { Setting } from "@/api/admin/types/Setting"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
// 判断是否 是一个 对象字面量
import { isPlainObject } from "lodash-es"

const centerDialogVisible = defineModel<boolean>()

const createData = reactive<Setting>({
  id: -1,
  name: "",
  content: "",
  arrayContent: [],
})

// 保存 类型
const contentType = ref<"string" | "array" | "object">("string")
// 下拉框
const contentTypeOptions = ref([
  { value: "string", label: "字符串" },
  { value: "array", label: "数组" },
  { value: "object", label: "对象" },
])
watch(
  () => contentType.value,
  (newV) => {
    if (newV === "string") createData.content = ""
    if (newV === "array") createData.arrayContent = []
    if (newV === "object") createData.content = JSON.stringify({})
  }
)

const tagsInstance = ref()
// 内容 的验证器
const contentValidator = (rule: any, value: any, callback: any) => {
  // string 且 有内容
  if (contentType.value === "string" && !value.length)
    return callback(new Error("内容必须要有内容"))

  // 只验证 字面量的形式的 object
  if (contentType.value !== "object") return callback()
  try {
    isPlainObject(JSON.parse(value))
    callback()
  } catch (error) {
    callback(new Error('内容必须要是对象的字面量形式：{"key":"value"}'))
  }
}
// 创建规则
const createRules = reactive({
  name: [
    { required: true, trigger: "change", message: "设置名是必填项" },
    {
      required: true,
      trigger: "change",
      min: 1,
      max: 32,
      message: "设置名字长度必须在1-32之间哦",
    },
  ],
  content: [
    {
      trigger: "change",
      validator: contentValidator, // 使用自定义验证函数
    },
  ],
})

// 初始化
const init = () => {
  centerDialogVisible.value = true
}

// 表单实例
const formInstance = ref()

// 关闭
const handlerClose = () => {
  formInstance.value.resetFields()
}

// 夫组件的自定义事件
const emit = defineEmits<{
  req: []
}>()

// 确认
const handlerConfirm = async () => {
  // 验证 tags
  if (contentType.value === "array") {
    tagsInstance.value.validate()
  }
  try {
    // 表单校验
    await formInstance.value.validate()
    const updateData = JSON.parse(JSON.stringify(createData))
    // 处理 数据格式
    if (contentType.value === "object")
      updateData.content = JSON.parse(updateData.content)
    if (contentType.value === "array")
      updateData.content = updateData.arrayContent
    delete updateData.arrayContent

    await createSetting(updateData)
    ElMessage.success(`创建设置成功~`)
    centerDialogVisible.value = false
    // 重新请求
    await emit("req")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("创建设置失败~")
  }
}

// 暴露
defineExpose({ init })
</script>

<style lang="scss">
.manager-dialog {
  --el-dialog-bg-color: var(--drawer-bg);
  --el-dialog-box-shadow: unset;
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__label {
    color: var(--primary-color);
    padding: 0;
  }
}
</style>
