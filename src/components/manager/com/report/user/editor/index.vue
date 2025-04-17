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
        <div class="color-[var(--primary-color)]">编辑用户</div>
      </template>
      <el-form
        :model="createData"
        :rules="editorRules"
        label-position="right"
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
        <el-form-item label="签名" prop="signer">
          <my-input
            placeholder="请输入签名"
            v-model="createData.signer"
          ></my-input>
        </el-form-item>
        <el-form-item label="原头像">
          <div class="ml-20px">
            <!-- 头像 -->
            <global-avatar-src
              :account="createData.account"
              :avatar="createData.avatar"
              :style="{ '--avatar-size': '60px' }"
              :isTo="false"
              :isCursor="false"
              class="flex-shrink-0"
            ></global-avatar-src>
          </div>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <my-input
            placeholder="请输入头像"
            v-model="createData.avatar"
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

<script setup lang="ts" name="ReportUserEditor">
// 引入 接口
import { managerUpdateUser, userFindByPk } from "@/api/user"
// 引入 类型
import { User } from "@/api/user/types/searchUserPagination"
// 引入验证
import { accountReg, emailReg, nickNameReg } from "@/RegExp/loginOrReg"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

// 导出 函数
const { userInfoByToken } = useUserStore()
const centerDialogVisible = ref(false)
const createData = reactive<User>({
  account: "",
  avatar: "",
  createdAt: "",
  email: "",
  id: -1,
  isBin: "",
  nickName: "",
  roles: [],
  signer: "",
  updatedAt: "",
})
// 编辑规则
const editorRules = reactive({
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
})

// 处理编辑
const init = async (userId: number) => {
  if (!userId) return ElMessage.warning("没有userId")
  // 得到用户的信息
  const user = await userFindByPk(userId)
  Object.assign(createData, user)
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
    // 更新用户
    const result = await managerUpdateUser(createData)
    // 修改到自身
    if (result?.isUser) {
      // 重新获取信息
      userInfoByToken(result?.token || "")
    }
    ElMessage.success("修改用户信息成功~")
    centerDialogVisible.value = false
    // 重新请求
    emit("req", true)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("修改用户信息失败~")
  }
}
// 暴露
defineExpose({ init })
</script>
