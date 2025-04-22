<template>
  <div class="reg card_style" ref="reg">
    <h1 class="text-center mt-0">注册</h1>
    <el-form
      label-width="70px"
      @submit.prevent="handlerReg"
      label-position="left"
      :model="regData"
      :rules="regRules"
      ref="regForm"
    >
      <el-form-item label="账号" prop="account">
        <my-input
          placeholder="Account"
          v-model.trim="regData.account"
          :prefix-icon="userIcon"
        ></my-input>
      </el-form-item>
      <el-form-item label="用户名" prop="nickName">
        <my-input
          placeholder="NickName"
          v-model.trim="regData.nickName"
          :prefix-icon="userIcon"
        ></my-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <my-input
          placeholder="E-Mail"
          v-model.trim="regData.email"
          :prefix-icon="emailIcon"
        ></my-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="flex w-100%">
          <my-input
            placeholder="Code"
            v-model="regData.code"
            class="flex-1"
            :prefix-icon="codeIcon"
          >
          </my-input>
          <my-button
            type="primary"
            class="w-50px ml-10px"
            :disabled="!codeIsActive"
            v-debounce="{ fn: handlerCode }"
          >
            {{ code }}
          </my-button>
        </div>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <my-input
          placeholder="Password"
          show-password
          v-model="regData.password"
          autocomplete="off"
          :prefix-icon="passIcon"
        ></my-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <my-input
          placeholder="Confirm Password"
          show-password
          v-model="regData.confirmPassword"
          autocomplete="off"
          :prefix-icon="confirmPassIcon"
        ></my-input>
      </el-form-item>
      <my-button type="primary" class="w-100% mt-5px" native-type="submit"
        >注册</my-button
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
import {
  accountReg,
  pwdReg,
  emailReg,
  codeReg,
  nickNameReg,
} from "@/RegExp/loginOrReg"
// 引入 时间转换 转换 code 过期时间提示
import { formatMilliseconds } from "@/utils/times/timeFormatter"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
// 引入api
import { reqRegEmail, reqReg } from "@/api/user"
import throttle from "@/utils/throttle"
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
    return next(new Error("确认密码需要与密码一致"))
  next()
}
// 注册规则
const regRules = reactive({
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
    { required: true, trigger: "change", message: "用户名是必填项" },
    {
      required: true,
      trigger: "change",
      pattern: nickNameReg.reg,
      message: nickNameReg.msg,
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
const handlerReg = throttle(async () => {
  try {
    await regForm.value.validate()
    await reqReg(regData)
    ElMessage.success("注册成功~")
    toLogin()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("注册失败~")
  }
}, 1000)

// 判断是否是 开发环境
const isDev = import.meta.env.DEV
let tim: setTimout | null
// 发送验证码按钮
const handlerCode = async () => {
  try {
    // 验证 邮箱
    await regForm.value.validateField("email")
    // 发生 邮件
    const result = await reqRegEmail({ email: regData.email })
    // 得到 过期时间
    const expire = formatMilliseconds(result.expire)
    ElMessage.success(`验证码发送成功，有效时间${expire}~`)
    // 开发环境 直接赋值 code 结果 测试用
    if (isDev) regData.code = `${result.regCode}` || ""
    // 处理成功的 事件
    codeIsActive.value = false
    tim = setInterval(() => {
      --code.value
      if (code.value < 0) {
        code.value = initCode
        codeIsActive.value = true
        tim && clearInterval(tim)
      }
    }, 1000)
  } catch (error) {
    const err = handlerReqErr(error, "warning")
    if (!err) ElMessage.error("发送验证码失败")
  }
}
onBeforeUnmount(() => tim && clearInterval(tim))
defineExpose({ reg })
</script>

<style scoped></style>
