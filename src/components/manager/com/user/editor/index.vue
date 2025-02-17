<template>
  <teleport to="body">
    <my-context-menu>
      <el-dialog
        class="manager-dialog"
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
          :model="editorData"
          :rules="editorRules"
          label-position="left"
          label-width="60"
          ref="formInstance"
          @submit.prevent="handlerConfirm"
        >
          <el-form-item label="账号" prop="account">
            <my-input
              placeholder="账号"
              v-model="editorData.account"
            ></my-input>
          </el-form-item>
          <el-form-item label="用户名" prop="nickName">
            <my-input
              placeholder="用户名"
              v-model="editorData.nickName"
            ></my-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <my-input placeholder="邮箱" v-model="editorData.email"></my-input>
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
    </my-context-menu>
  </teleport>
</template>

<script setup lang="ts" name="UserEditor">
// 引入 接口
import { managerUpdateUser } from "@/api/user"
// 引入 类型
import { User } from "@/api/user/types/searchUserPagination"
// 引入验证
import { accountReg, emailReg, nickNameReg } from "@/RegExp/loginOrReg"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取数据
const { userToken } = storeToRefs(useUserStore())

const centerDialogVisible = ref(false)
const editorData = reactive<User>({
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
// 登录规则
const editorRules = reactive({
  account: [
    { required: true, trigger: "change", message: "账号是必填项哦~" },
    {
      required: true,
      trigger: "change",
      pattern: accountReg.reg,
      message: accountReg.msg,
    },
  ],
  nickName: [
    { required: true, trigger: "change", message: "账号是必填项哦~" },
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
const initEditor = (row: User) => {
  centerDialogVisible.value = true
  Object.assign(editorData, row)
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
  try {
    // 表单校验
    await formInstance.value.validate()
    // 更新用户
    const result = await managerUpdateUser(editorData)
    // 修改到自身
    if (result?.isUser) {
      // 重新赋值 token
      userToken.value = result.token
    }
    ElMessage.success("修改用户信息成功~")
    centerDialogVisible.value = false
    // 重新请求
    await emit("req")
  } catch (error) {}
}
// 暴露
defineExpose({ initEditor })
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
