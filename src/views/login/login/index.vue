<template>
  <div class="login card_style" ref="login">
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
          placeholder="Account or Email"
          v-model.trim="loginData.account"
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
        class="w-100% mt-5px"
        v-debounce="{ fn: handlerLogin }"
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
</template>

<script setup lang="ts" name="Login">
// 引入图标
import userIcon from "@/components/icon/login/user.vue"
import passIcon from "@/components/icon/login/pass.vue"
// 引入正则
import { accountReg, pwdReg } from "@/RegExp/loginOrReg"
// 引入api
import { reqLogin } from "@/api/user"
// 引入仓库
import { useUserStore } from "@/store/user"
// 导出对应数据
const { userToken } = storeToRefs(useUserStore())
const props = defineProps(["reg"])
// 登录的表单数据
const loginData = reactive({
  account: "",
  password: "",
})

// 登录规则
const loginRules = reactive({
  account: [
    { required: true, trigger: "change", message: "账号是必填项哦~" },
    {
      required: true,
      trigger: "change",
      pattern: accountReg.reg,
      message: accountReg.msg,
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
})

// 获取表单对象
const loginForm = ref()
// 获取组件实例
const login = ref()
const router = useRouter()
// 处理登录
const handlerLogin = async () => {
  try {
    await loginForm.value.validateField()
    const result = await reqLogin(loginData)
    userToken.value = result?.token
    ElMessage.success("登录成功~")
    router.push("/")
  } catch (error) {}
}
// 前往注册的切换动画
const toReg = () => {
  props.reg.style.transform = "rotateY(0deg)"
  login.value.style.transform = "rotateY(180deg)"
  loginForm.value.resetFields()
}
defineExpose({ login })
</script>

<style scoped></style>
