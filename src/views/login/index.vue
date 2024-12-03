<template>
  <layout-header></layout-header>
  <layout-banner></layout-banner>
  <div class="container" ref="container">
    <div class="login" ref="login">
      <h1 class="text-center mt-0">登录</h1>
      <el-form
        label-width="width"
        :model="loginData"
        @keyup.enter="handlerLogin"
      >
        <el-form-item label="账号">
          <el-input
            placeholder="Account"
            v-model="loginData.account"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            placeholder="Password"
            v-model="loginData.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          class="primary-button w-100%"
          @click="handlerLogin"
          >登录</el-button
        >
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
      >
        <el-form-item label="账号">
          <el-input placeholder="Account" v-model="regData.account"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input placeholder="E-Mail" v-model="regData.email"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <div class="flex w-100%">
            <el-input placeholder="Code" v-model="regData.code" class="flex-1">
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
        <el-form-item label="密码">
          <el-input
            placeholder="Password"
            v-model="regData.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            placeholder="Confirm Password"
            v-model="regData.confirmPassword"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          class="primary-button w-100%"
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
const { cardBoxShadow } = storeToRefs(useSettingStore())
const container = ref()
const login = ref()
const reg = ref()
const initCode = 5
const code = ref(initCode)
const codeIsActive = ref(true)
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
  container.value.style.height = regHeight + "px"
  container.value.style.transform = "rotateY(180deg)"
  login.value.style.opacity = "0"
  login.value.style.zIndex = "1"
  reg.value.style.opacity = "1"
}
// 前往登录的切换动画
const toLogin = () => {
  container.value.style.height = loginHeight + "px"
  container.value.style.transform = "rotateY(0deg)"
  login.value.style.opacity = "1"
  login.value.style.zIndex = "2"
  reg.value.style.opacity = "0"
}
// 处理登录
const handlerLogin = () => {
  console.log(loginData)
}
// 处理注册
const handlerReg = () => {
  console.log(regData)
}
// 发送验证码按钮
const handlerCode = () => {
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
// 获取注册和登录的高度
let loginHeight: string
let regHeight: string
onMounted(() => {
  loginHeight = login.value.offsetHeight
  regHeight = reg.value.offsetHeight
  // 默认展示的登录 给容器赋初值
  container.value.style.height = loginHeight + "px"
})
</script>

<style scoped lang="scss">
$during: 0.7s;
$link: red;
.container {
  position: absolute;
  width: 50%;
  // height: 400px;
  z-index: 2;
  inset: 0;
  margin: auto;
  fill-opacity: 0.5;
  color: var(--primary-color);
  border-radius: 15px;
  transition: transform $during, height $during;
  overflow: hidden;
  box-shadow: v-bind(cardBoxShadow);
  background-color: var(--login-card-bg);
  backdrop-filter: blur(0.5px);
  .reg,
  .login {
    width: 100%;
    // height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 20px 40px;
    .tip {
      margin-top: 10px;
      .link {
        color: $link;
      }
    }
    .primary-button {
      @include primary-button;
    }
  }
  .login {
    z-index: 2;
    transition: opacity $during;
  }
  .reg {
    transform: rotateY(180deg);
    opacity: 0;
    transition: opacity $during;
  }
}
</style>
