<template>
  <div class="user-editor-container">
    <h2 class="title text-center">用户编辑</h2>
    <div class="content">
      <div class="left">
        <el-form
          label-width="60px"
          label-position="right"
          :model="userEditorData"
          :rules="formRules"
          ref="formInstance"
        >
          <el-form-item label="账号" prop="account">
            <my-input
              class="login-input"
              placeholder="Account or Email"
              v-model.trim="userEditorData.account"
              :prefix-icon="userIcon"
            ></my-input>
          </el-form-item>
          <el-form-item label="用户名" prop="nickName">
            <my-input
              class="login-input"
              placeholder="Account or Email"
              v-model.trim="userEditorData.nickName"
              :prefix-icon="userIcon"
            ></my-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <my-input
              class="login-input"
              placeholder="Account or Email"
              v-model.trim="userEditorData.email"
              :prefix-icon="userIcon"
            ></my-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <div class="flex w-100%">
              <my-input
                placeholder="Code"
                v-model="userEditorData.code"
                class="login-input flex-1"
                :prefix-icon="codeIcon"
              >
              </my-input>
              <my-button
                type="primary"
                class="w-50px mr-10px"
                :disabled="!codeIsActive"
                v-debounce="{ fn: handlerCode }"
              >
                {{ code }}
              </my-button>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <my-input
              class="login-input"
              placeholder="Password"
              v-model="userEditorData.password"
              show-password
              autocomplete="off"
              :prefix-icon="passIcon"
            ></my-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <my-input
              class="login-input"
              placeholder="Confirm Password"
              v-model="userEditorData.confirmPassword"
              show-password
              autocomplete="off"
              :prefix-icon="passIcon"
            ></my-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 头像 -->
      <div class="right">
        <div class="text-20px">头像</div>
        <!-- 头像 -->
        <my-upload v-model="avatar" :auto-remove="false"></my-upload>
      </div>
    </div>
    <my-button @click="handlerUpdate"> 更新用户 </my-button>
  </div>
</template>

<script setup lang="ts" name="PanelUserEditor">
// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入图标
import userIcon from "@/components/icon/login/user.vue"
import passIcon from "@/components/icon/login/pass.vue"
import codeIcon from "@/components/icon/login/code.vue"
import {
  accountReg,
  codeReg,
  emailReg,
  nickNameReg,
  pwdReg,
} from "@/RegExp/loginOrReg"
import { updateUser, updateUserEmail } from "@/api/user"
import { formatMilliseconds } from "@/utils/times/timeFormatter"
import { UpdateUserBody } from "@/api/user/types/updateUserBody"

// 导入 默认的图片
const default_avatar = new URL("@/assets/images/avatar.jpg", import.meta.url)
  .href

// 提取需要的数据 和 方法 不需要 响应式
const {
  userAvatar,
  userAccount,
  userNickName,
  userEmail,
  userSigner,
  userInfoByToken,
} = useUserStore()

// 表单 数据
const userEditorData = reactive<UpdateUserBody>({
  avatar: userAvatar || default_avatar,
  account: userAccount,
  nickName: userNickName,
  email: userEmail,
  signer: userSigner,
  password: "",
  confirmPassword: "",
  code: "",
})
// 展示 的 头像
const avatar = ref([{ name: "default", url: userEditorData.avatar }])
// 确认密码验证回调
const validatorConfirm = (_: any, value: any, next: any) => {
  if (value !== userEditorData.password)
    return next(new Error("确认密码需要与密码一致哦~"))
  next()
}

// 注册规则
const formRules = reactive({
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
    { required: true, trigger: "change", message: "用户名是必填项哦~" },
    {
      required: true,
      trigger: "change",
      pattern: nickNameReg.reg,
      message: nickNameReg.msg,
    },
  ],
  password: [
    { trigger: "change", message: "密码是必填项哦~" },
    {
      trigger: "change",
      min: 6,
      max: 12,
      message: "密码必须要在6-12位哦~",
    },
    {
      trigger: "change",
      pattern: pwdReg.reg,
      message: pwdReg.msg,
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
  code: [
    {
      required: true,
      trigger: "change",
      pattern: codeReg.reg,
      message: codeReg.msg,
    },
  ],
  confirmPassword: [{ trigger: "change", validator: validatorConfirm }],
})
// form组件 实例
const formInstance = ref()

// 验证 码
// code倒计时
const initCode = 5
const code = ref(initCode)
// 控制code按钮是否禁用
const codeIsActive = ref(true)

// 判断是否是 开发环境
const isDev = import.meta.env.DEV

// 发送验证码按钮
const handlerCode = async () => {
  try {
    // 验证 邮箱
    await formInstance.value.validateField("email")
    // 发送 邮件
    const result = await updateUserEmail({ email: userEditorData.email })
    // 得到 过期时间
    const expire = formatMilliseconds(result.expire)
    ElMessage.success(`验证码发送成功，有效时间${expire}~`)
    // 开发环境 直接赋值 code 结果 测试用
    if (isDev) userEditorData.code = `${result.updateCode}` || ""
    // 处理成功的 事件
    codeIsActive.value = false
    const tim = setInterval(() => {
      --code.value
      if (code.value < 0) {
        code.value = initCode
        codeIsActive.value = true
        clearInterval(tim)
      }
    }, 1000)
  } catch (error) {}
}

// 更新的 回调
const handlerUpdate = async () => {
  try {
    await formInstance.value.validate()
    const uploadAvatar = avatar.value?.[0]?.url
    // 处理 avatar 字段 存在 且不是默认的图片
    const _avatar =
      (uploadAvatar && uploadAvatar !== default_avatar && uploadAvatar) || null
    userEditorData.avatar = _avatar
    // 更新 数据
    const result = await updateUser(userEditorData)
    // 重新获取信息
    userInfoByToken(result?.token || "")
    ElMessage.success("修改成功~")
  } catch (error) {}
}
</script>

<style scoped lang="scss">
.user-editor-container {
  > .content {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    // 左侧 信息
    > .left {
      width: 100%;
      ::v-deep(.el-form-item__label) {
        color: var(--primary-color);
        padding: unset;
      }
      ::v-deep(.el-icon) {
        color: var(--primary-color);
      }
    }
    // 头像
    > .right {
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
  }
}
</style>
