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
        <el-form-item label="分类" prop="type" required>
          <my-select
            v-model="createData.type"
            :options="typeOptions"
            class="ml-10px w-100px"
          ></my-select>
        </el-form-item>
        <el-form-item label="敏感词" prop="word">
          <my-input placeholder="敏感词" v-model="createData.word"></my-input>
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

<script setup lang="ts" name="FilterWordCreate">
// 引入api
// 引入 类型
// 引入 处理错误的 请求函数
import { addFilterWord } from "@/api/admin/filter"
import { handlerReqErr } from "@/utils/request/error/successError"
const centerDialogVisible = ref(false)

const createData = reactive({
  word: "",
  type: "",
})
type optionsType = { value: string; label: string }[]
const typeOptions = ref<optionsType>()
// 创建规则
const createRules = reactive({
  word: [
    { required: true, trigger: "change", message: "敏感词是必填项" },
    {
      required: true,
      trigger: "change",
      min: 1,
      max: 255,
      message: "敏感词字长度必须在1-255之间哦",
    },
  ],
})

// 初始化
const init = (_type: string, _typeOptions: optionsType) => {
  centerDialogVisible.value = true
  createData.type = _type
  typeOptions.value = _typeOptions
}

// 表单组件实例
const formInstance = ref()

// 关闭
const handlerClose = () => {
  formInstance.value.resetFields()
  typeOptions.value = undefined
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

    await addFilterWord(toRaw(createData))
    ElMessage.success(`创建敏感词成功~`)

    centerDialogVisible.value = false

    // 重新请求
    emit("req", true)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("创建敏感词失败~")
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
