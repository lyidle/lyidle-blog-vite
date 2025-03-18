<template>
  <teleport to="body">
    <el-dialog
      class="manager-dialog"
      v-model="centerDialogVisible"
      :width="dialogWidth"
      align-center
      draggable
      @close="handlerClose"
    >
      <template #header>
        <div class="color-[var(--primary-color)]">编辑设置</div>
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
          v-if="createData.name !== '关于'"
          v-model="contentType"
          :options="contentTypeOptions"
          class="w-70px float-right"
        ></my-select>
        <el-form-item
          label="内容"
          prop="content"
          v-if="createData.name !== '关于'"
        >
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
            @blur="inputBlur"
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
        </el-form-item>
        <div v-if="createData.name === '关于'">
          <h1 class="text-center color-[var(--primary-color)] cur-text">
            内容
          </h1>
          <!-- vditor -->
          <vditor-editor
            v-if="isEditor"
            v-model:docHeight="docHeight"
            v-model:context="context"
            :isAutoMount="false"
            ref="vditorInstance"
          ></vditor-editor>
        </div>
        <!-- 关于 界面 -->
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

<script setup lang="ts" name="SettingEditor">
// 引入 接口
import { updateSetting } from "@/api/admin"
// 引入 类型
import type { Setting } from "@/api/admin/types/Setting"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
// 判断是否 是一个 对象字面量
import { isPlainObject } from "lodash-es"
// 是否是 vditor
import { isVditorEditor } from "."
// 解压缩 vditor的 内容
import { decompressStringNotError } from "@/utils/compression"
// 处理 content
import { useMdReplaceImg } from "@/hooks/Doc/vditorEditor/mdImgToLinkPermanent"

// dialog相关
const centerDialogVisible = defineModel<boolean>()
const initialDialogWidth = 500
const dialogWidth = ref<string | number>(initialDialogWidth)

const createData = reactive<Setting>({
  id: -1,
  name: "",
  content: "",
  arrayContent: [],
})

// vditor 相关
const docHeight = ref("60vh")
const context = ref("")
const isEditor = ref(false)
const vditorInstance = ref()

// 保存 类型
const contentType = ref<"string" | "array" | "object">("string")
// 下拉框
const contentTypeOptions = ref([
  { value: "string", label: "字符串" },
  { value: "array", label: "数组" },
  { value: "object", label: "对象" },
])
const tagsInstance = ref()
// 内容 的验证器
const contentValidator = (rule: any, value: any, callback: any) => {
  // string 且 有内容
  if (contentType.value === "string" && !value.length)
    return callback(new Error("内容必须要有内容"))

  // 只验证 字面量的形式的 object
  if (contentType.value !== "object") return
  try {
    const content = JSON.parse(value)
    // 不是对象
    if (!isPlainObject(content)) {
      callback(new Error('内容必须要是对象的字面量形式：{"key":"value"}'))
      return
    }
  } catch (error) {
    callback(new Error('内容必须要是对象的字面量形式：{"key":"value"}'))
  }
}

// 失焦时 格式化 json 文本
const inputBlur = () => {
  createData.content = JSON.stringify(
    JSON.parse(createData.content as string),
    null,
    2
  )
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

// 判断是否是 vditor
const isVditorEditorCallback = (name: string) => {
  if (!isVditorEditor(name)) return
  isEditor.value = true
  dialogWidth.value = "80%"
}

// 初始化
const init = (row: Setting) => {
  centerDialogVisible.value = true
  // json 化
  const jsonRow = JSON.stringify(row)
  // 简单的深拷贝
  const _row = JSON.parse(jsonRow)
  // 分配变量
  createData.id = _row.id
  createData.name = _row.name

  // 判断是否是 vditor
  isVditorEditorCallback(_row.name)

  // 初始化 content 和 类型
  // string
  if (typeof _row.content === "string") {
    contentType.value = "string"

    // 判断是否是 vditor 编辑器
    if (isEditor.value) {
      context.value = decompressStringNotError(_row.content) as string
    } else createData.content = _row.content
  }
  // array
  if (Array.isArray(_row.content)) {
    contentType.value = "array"
    createData.arrayContent = _row.content
  }
  // object
  if (isPlainObject(_row.content)) {
    contentType.value = "object"
    createData.content = JSON.stringify(_row.content, null, 2)
  }
}

// 表单实例
const formInstance = ref()

// 关闭
const handlerClose = () => {
  formInstance.value.resetFields()
  createData.arrayContent = []
  isEditor.value = false
  context.value = ""
  dialogWidth.value = initialDialogWidth
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

    // 是否是 vditor
    if (isEditor) {
      const content = vditorInstance.value.getContext()
      updateData.content = content
      // 处理文章的 内容
      await useMdReplaceImg(content, updateData, { path: "/manager" })
    }

    // 更新
    await updateSetting(updateData)
    ElMessage.success(`修改设置成功~`)
    centerDialogVisible.value = false
    // 重新请求
    await emit("req")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("修改设置失败~")
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
