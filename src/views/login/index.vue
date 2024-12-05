<template>
  <layout-header></layout-header>
  <layout-banner></layout-banner>
  <div class="container" ref="container">
    <div class="login" ref="login">
      <h1 class="text-center mt-0">登录</h1>
      <el-form
        label-width="40px"
        label-position="left"
        :model="loginData"
        @keyup.enter="handlerLogin"
        :rules="loginRules"
        ref="loginForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            placeholder="Account"
            v-model="loginData.account"
            :prefix-icon="userIcon"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="Password"
            v-model="loginData.password"
            show-password
            autocomplete="off"
            :prefix-icon="passIcon"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          class="primary-button w-100% mt-5px"
          @click="handlerLogin"
        >
          登录
        </el-button>
      </el-form>
      <div class="tip text-center">
        <span>没有账号？</span>
        <span class="cursor-[var(--cursor-pointer)] link" @click="toReg"
          >去注册</span
        >
      </div>
    </div>
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
              class="primary-button w-50px ml-10px"
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
        <el-button
          type="primary"
          class="primary-button w-100% mt-5px"
          @click="handlerReg"
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
  </div>
</template>

<script setup lang="ts" name="Login">
import { useSettingStore } from "@/store/setting"
// 引入图标
import userIcon from "@/components/icon/login/user.vue"
import passIcon from "@/components/icon/login/pass.vue"
import confirmPassIcon from "@/components/icon/login/confirm-pass.vue"
import emailIcon from "@/components/icon/login/email.vue"
import codeIcon from "@/components/icon/login/code.vue"
// 导出仓库需要的东西
const { cardBoxShadow } = storeToRefs(useSettingStore())
// 获取组件实例
const container = ref()
const login = ref()
const reg = ref()
// code倒计时
const initCode = 5
const code = ref(initCode)
// 控制code按钮是否禁用
const codeIsActive = ref(true)
// 获取表单对象
const loginForm = ref()
const regForm = ref()
// 登录的表单数据
const loginData = reactive({
  account: "",
  password: "",
})
// 注册的表单数据
const regData = reactive({
  account: "",
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
})
// 前往注册的切换动画
const toReg = () => {
  reg.value.style.transform = "rotateY(0deg)"
  login.value.style.transform = "rotateY(180deg)"
  loginForm.value.resetFields()
}
// 前往登录的切换动画
const toLogin = () => {
  reg.value.style.transform = "rotateY(180deg)"
  login.value.style.transform = "rotateY(0deg)"
  regForm.value.resetFields()
}
// 正则
// 账号大于等于3位 不能重复
// 密码
const passReg =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@,_.])[a-zA-Z0-9$@,_.]{6,12}$/
// 邮箱
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// 验证码正则
const codeReg = /^[0-9]{6}$/
// 登录规则
const loginRules = reactive({
  account: [
    { required: true, trigger: "change", message: "账号是必填项哦~" },
    {
      required: true,
      trigger: "change",
      min: 3,
      message: "账号长度最少要是三位哦~",
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
      pattern: passReg,
      message:
        "密码需要必须包含数字、字母小写与大写，和特殊字符($@,_.)中的一个~",
    },
  ],
})
// 处理登录
const handlerLogin = () => {
  console.log(loginData)
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
      min: 3,
      message: "账号长度最少要是三位哦~",
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
      pattern: passReg,
      message:
        "密码需要必须包含数字、字母小写与大写，和特殊字符($@,_.)中的一个哦~",
    },
  ],
  email: [
    {
      required: true,
      trigger: "change",
      pattern: emailReg,
      message: "邮箱格式不正确哦~",
    },
  ],
  code: [
    {
      required: true,
      trigger: "change",
      pattern: codeReg,
      message: "验证码格式不正确哦~",
    },
  ],
  confirmPassword: [
    { required: true, trigger: "change", validator: validatorConfirm },
  ],
})
// 处理注册
const handlerReg = async () => {
  await regForm.value.validate()
}
// 发送验证码按钮
const handlerCode = async () => {
  await regForm.value.validateField("email")
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
</script>

<style scoped lang="scss">
$rotate-during: var(--login-rotate-during);
$link-color: var(--login-link-color);
$color: var(--primary-color);
.container {
  position: absolute;
  width: 50%;
  z-index: 2;
  // 水平居中
  inset: 0;
  margin: auto;
  color: $color;
  // 使用flex 内容居中
  display: flex;
  align-items: center;
  .reg,
  .login {
    width: 100%;
    // 都脱离文档流
    position: absolute;
    padding: 20px 40px;
    border-radius: 15px;
    box-shadow: v-bind(cardBoxShadow);
    background-color: var(--login-card-bg);
    backdrop-filter: blur(0.5px);
    // 旋转过渡
    transition: transform $rotate-during;
    // 当在背面时不可见
    backface-visibility: hidden;
    // 底部的提示信息 切换链接
    .tip {
      margin-top: 10px;
      .link {
        color: $link-color;
        @include pages-links-hover;
      }
    }
    // el-label
    ::v-deep(.el-form-item__label) {
      color: var(--primary-color);
      padding-right: unset;
    }
    // 应用按钮样式
    .primary-button {
      @include login-button;
    }
    // el-input
    @include login-input;
    // 表单验证的提示信息
    ::v-deep(.el-form-item__error) {
      left: 10px;
    }
  }
  .reg {
    // 先隐藏注册
    transform: rotateY(180deg);
  }
}
</style>
