<template>
  <teleport to="body">
    <el-dialog
      class="primary-dialog"
      v-model="centerDialogVisible"
      width="500"
      align-center
      draggable
      @close="handlerClose"
    >
      <template #header>
        <div class="color-[var(--primary-color)]">创建用户</div>
      </template>
      <el-form
        :model="createData"
        :rules="createRules"
        label-position="left"
        label-width="60"
        ref="formInstance"
        @submit.prevent="handlerConfirm"
      >
        <el-form-item label="账号" prop="account">
          <my-input
            placeholder="请输入账号"
            v-model="createData.account"
          ></my-input>
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          <my-input
            placeholder="请输入用户名"
            v-model="createData.nickName"
          ></my-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <my-input
            placeholder="请输入邮箱"
            v-model="createData.email"
          ></my-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <my-input
            placeholder="请输入密码"
            v-model="createData.password"
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

<script setup lang="ts" name="UserCreate">
// 引入接口
import { managerCreateUser } from "@/api/user"
// 引入 类型
import { CreateUserBody } from "@/api/user/types/createUserBody"
// 引入 正则
import { accountReg, emailReg, nickNameReg, pwdReg } from "@/RegExp/loginOrReg"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

const centerDialogVisible = ref(false)

const createData = reactive<CreateUserBody>({
  account: "",
  nickName: "",
  email: "",
  password: "",
})

// 创建规则
const createRules = reactive({
  account: [
    { required: true, trigger: "change", message: "账号是必填项" },
    {
      required: true,
      trigger: "change",
      pattern: accountReg.reg,
      message: accountReg.msg,
    },
  ],
  nickName: [
    { required: true, trigger: "change", message: "账号是必填项" },
    {
      required: true,
      trigger: "change",
      pattern: nickNameReg.reg,
      message: nickNameReg.msg,
    },
  ],
  email: [
    {
      required: true,
      trigger: "change",
      pattern: emailReg.reg,
      message: emailReg.msg,
    },
  ],
  password: [
    { required: true, trigger: "change", message: "密码是必填项" },
    {
      required: true,
      trigger: "change",
      min: 6,
      max: 12,
      message: "密码必须要在6-12位",
    },
    {
      required: true,
      trigger: "change",
      pattern: pwdReg.reg,
      message: pwdReg.msg,
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
  (e: "req", stay?: boolean): []
}>()

// 确认
const handlerConfirm = async () => {
  try {
    // 表单校验
    await formInstance.value.validate()
    await managerCreateUser(createData)
    ElMessage.success(`创建用户成功~`)
    centerDialogVisible.value = false
    // 重新请求
    emit("req", true)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("创建用户失败~")
  }
}

// 暴露
defineExpose({ init })
</script>
