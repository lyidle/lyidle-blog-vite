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
        :rules="loginRules"
      >
        <el-form-item label="账号" prop="account">
          <input
            placeholder="Account"
            v-model="loginData.account"
          ></input>
          <div class="error">1212</div>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <input
            placeholder="Password"
            v-model="loginData.password"
            type="password"
            autocomplete="off"
          ></input>
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
          <input placeholder="Account" v-model="regData.account"></input>
        </el-form-item>
        <el-form-item label="邮箱">
          <input placeholder="E-Mail" v-model="regData.email"></input>
        </el-form-item>
        <el-form-item label="验证码">
          <div class="flex w-100%">
            <input placeholder="Code" v-model="regData.code" class="flex-1">
            </input>
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
          <input
            placeholder="Password"
            v-model="regData.password"
            autocomplete="off"
          ></input>
        </el-form-item>
        <el-form-item label="确认密码">
          <input
            placeholder="Confirm Password"
            v-model="regData.confirmPassword"
            autocomplete="off"
          ></input>
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
  reg.value.style.transform='rotateY(0deg)'
  login.value.style.transform='rotateY(180deg)'
}
// 前往登录的切换动画
const toLogin = () => {
  reg.value.style.transform='rotateY(180deg)'
  login.value.style.transform='rotateY(0deg)'
}
const loginRules = reactive({
  account:[{required:true,trigger:'change'}],
password:[{required:true,trigger:'change'}]
})
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
</script>

<style scoped lang="scss">
$rotate-during: var(--login-rotate-during);
$link-color: var(--login-link-color);
$color:var(--primary-color);
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
    backdrop-filter: blur(.5px);
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
    }
    // 应用按钮样式
    .primary-button {
      // active
      transition: background var(--primary-during);
      --el-button-bg-color: var(--login-btn-bg);
      --el-button-border-color: var(--login-btn-bg);
      --el-button-text-color: var(--login-btn-color);
      outline: none;
      --el-button-hover-bg-color: var(--login-btn-hover-bg);
      --el-button-hover-border-color: var(--login-btn-hover-bg);
      --el-button-hover-text-color: var(--login-btn-hover-color);
      --el-button-active-bg-color: var(--login-btn-hover-bg);
      --el-button-active-border-color: var(--login-btn-hover-bg);
      --el-button-active-text-color: var(--login-btn-hover-color);
      // disable
      --el-button-disabled-bg-color:var(--login-disabled-bg);
    }
    // input
    input{
      background-color: transparent;
      height: 24px;
      border: none;
      outline: none;
      width: 100%;
      border-bottom: 1px solid var(--login-input-underline-bg);
      font-size: 13px;
      transition:font-size var(--primary-during);
      color: var(--login-input-color);
      &:focus{
      font-size: 15px;
      }
      &::placeholder{
      color: var(--login-input-placeholder);
      }
    }
    // 表单错误
    .error{
      color: var(--el-color-danger);
      font-size: 12px;
      left: 0;
      line-height: 1;
      padding-top: 2px;
      position: absolute;
      top: 100%;
    }
  }
  .reg {
    // 先隐藏注册
    transform:rotateY(180deg);
  }
}
</style>
