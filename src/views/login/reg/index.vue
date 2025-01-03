<template>
  <div class="reg" ref="reg">
    <h1 class="text-center mt-0">注册</h1>
    <el-form
      label-width="70px"
      @keyup.enter="handlerReg"
      label-position="left"
      :rules="regRules"
      :model="regData"
      ref="regForm"
    >
      <el-form-item label="账号" prop="account">
        <el-input
          placeholder="Account"
          v-model="regData.account"
          :prefix-icon="userIcon"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="nickName">
        <el-input
          placeholder="NickName"
          v-model="regData.nickName"
          :prefix-icon="userIcon"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          placeholder="E-Mail"
          v-model="regData.email"
          :prefix-icon="emailIcon"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="flex w-100%">
          <el-input
            placeholder="Code"
            v-model="regData.code"
            class="flex-1"
            :prefix-icon="codeIcon"
          >
          </el-input>
          <el-button
            type="primary"
            class="w-50px ml-10px"
            @click="handlerCode"
            :disabled="!codeIsActive"
          >
            {{ code }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="Password"
          show-password
          v-model="regData.password"
          autocomplete="off"
          :prefix-icon="passIcon"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          placeholder="Confirm Password"
          show-password
          v-model="regData.confirmPassword"
          autocomplete="off"
          :prefix-icon="confirmPassIcon"
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="w-100% mt-5px" @click="handlerReg"
        >注册</el-button
      >
    </el-form>
    <div class="tip text-center">
      <span>有账号？</span>
      <span class="cursor-[var(--cursor-pointer)] link" @click="toLogin"
        >去登录</span
      >
    </div>
  </div>
</template>

<script setup lang="ts" name="Register">
// 引入图标
import userIcon from "@/components/icon/login/user.vue"
import passIcon from "@/components/icon/login/pass.vue"
import confirmPassIcon from "@/components/icon/login/confirm-pass.vue"
import emailIcon from "@/components/icon/login/email.vue"
import codeIcon from "@/components/icon/login/code.vue"
// 引入正则
import { accountReg, pwdReg, emailReg, codeReg, nickNameReg } from "../reg"
// 引入api
import { reqRegEmail, reqReg } from "@/api/user"
const props = defineProps(["login"])
const reg = ref()
// code倒计时
const initCode = 5
const code = ref(initCode)
// 控制code按钮是否禁用
const codeIsActive = ref(true)
const regForm = ref()
// 注册的表单数据
const regData = reactive({
  account: "",
  nickName: "",
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
})
// 前往登录的切换动画
const toLogin = () => {
  reg.value.style.transform = "rotateY(180deg)"
  props.login.style.transform = "rotateY(0deg)"
  regForm.value.resetFields()
}
// 确认密码验证回调
const validatorConfirm = (_: any, value: any, next: any) => {
  if (value !== regData.password)
    return next(new Error("确认密码需要与密码一致哦~"))
  next()
}
// 注册规则
const regRules = reactive({
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
    { required: true, trigger: "change", message: "密码是必填项哦~" },
    {
      required: true,
      trigger: "change",
      min: 6,
      max: 12,
      message: "密码必须要在6-12位哦~",
    },
    {
      required: true,
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
  confirmPassword: [
    { required: true, trigger: "change", validator: validatorConfirm },
  ],
})
// 处理注册
const handlerReg = async () => {
  await regForm.value.validate()
  await reqReg(regData)
  ElMessage.success("注册成功~")
  toLogin()
}
// 发送验证码按钮
const handlerCode = async () => {
  await regForm.value.clearValidate("code")
  await regForm.value.validateField("email")
  await reqRegEmail(regData.email)
  ElMessage.success("验证码发送成功，有效时间5分钟~")
  codeIsActive.value = false
  const tim = setInterval(() => {
    --code.value
    if (code.value < 0) {
      code.value = initCode
      codeIsActive.value = true
      clearInterval(tim)
    }
  }, 1000)
}
defineExpose({ reg })
</script>

<style scoped></style>
