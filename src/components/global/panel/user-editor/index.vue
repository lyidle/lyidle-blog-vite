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
              placeholder="Account or Email"
              v-model.trim="userEditorData.account"
              :prefix-icon="userIcon"
            ></my-input>
          </el-form-item>
          <el-form-item label="用户名" prop="nickName">
            <my-input
              placeholder="Account or Email"
              v-model.trim="userEditorData.nickName"
              :prefix-icon="userIcon"
            ></my-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <my-input
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
                class="flex-1"
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
              placeholder="Password"
              v-model="userEditorData.password"
              show-password
              autocomplete="off"
              :prefix-icon="passIcon"
            ></my-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <my-input
              placeholder="Confirm Password"
              v-model="userEditorData.confirmPassword"
              show-password
              autocomplete="off"
              :prefix-icon="passIcon"
            ></my-input>
          </el-form-item>
          <my-button @click="handlerUpdate"> 更新用户 </my-button>
        </el-form>
      </div>
      <!-- 头像 -->
      <div class="right">
        <div class="w-100%">
          <div class="text-20px text-center mb-15px">头像</div>
          <!-- 头像 -->
          <my-upload v-model="avatar" :auto-remove="false"></my-upload>
          <my-button @click="updateAvatar" class="mt-5px"> 更新头像 </my-button>
        </div>
        <div class="w-100% flex flex-col gap-15px">
          <div class="text-20px text-center">账号状态</div>
          <my-button class="!m-0" @click="toggleUserBin(userIsBin)">{{
            userIsBin ? "恢复账号" : "注销账号"
          }}</my-button>
          <my-button class="!m-0" v-if="userIsBin">彻底销毁</my-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="PanelUserEditor">
// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入图标
import userIcon from "@/components/icon/login/user.vue"
import passIcon from "@/components/icon/login/pass.vue"
import codeIcon from "@/components/icon/login/code.vue"
// 引入 正则
import {
  accountReg,
  codeReg,
  emailReg,
  nickNameReg,
  pwdReg,
} from "@/RegExp/loginOrReg"
// 引入 api 更新用户
import {
  recoverUser,
  removeUser,
  updateUser,
  updateUserAvatar,
  updateUserEmail,
} from "@/api/user"
// 引入 api 处理头像
import { postImgPermanent, removeFileStatic } from "@/api/img"
// 引入 类型
import type { UpdateUserBody } from "@/api/user/types/updateUserBody"
// 处理时间
import { formatMilliseconds } from "@/utils/times/timeFormatter"
// 引入仓库
import { useSettingStore } from "@/store/setting"

// 初始化仓库中用到的值
const { isShowPanel } = storeToRefs(useSettingStore())
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

// 导入 默认的图片
const default_avatar =
  "https://gcore.jsdelivr.net/gh/lyidle/static@1.0/assets/images/avatar.jpg"

// 提取需要的数据 和 方法
const { userInfoByToken } = useUserStore()
const {
  userAvatar,
  userAccount,
  userNickName,
  userEmail,
  userSigner,
  userToken,
  userIsBin,
} = storeToRefs(useUserStore())
// 表单 数据
// @ts-ignore
const userEditorData = reactive<UpdateUserBody>({})

const initData = () => {
  userEditorData.account = userAccount.value
  userEditorData.nickName = userNickName.value
  userEditorData.email = userEmail.value
  userEditorData.signer = userSigner.value
  userEditorData.password = ""
  userEditorData.confirmPassword = ""
  userEditorData.code = ""
}
// 初始化 数据
initData()

// 初始化头像的 函数
const avatarInit = () => userAvatar.value || default_avatar

// 展示 的 头像
const avatar = ref([{ name: "default", url: avatarInit() }])

// 确认密码验证回调
const validatorConfirm = (_: any, value: any, next: any) => {
  if (value !== userEditorData.password)
    return next(new Error("确认密码需要与密码一致"))
  next()
}

// 规则
const formRules = reactive({
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
    { trigger: "change", message: "密码是必填项" },
    {
      trigger: "change",
      min: 6,
      max: 12,
      message: "密码必须要在6-12位",
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
  } catch (error) {
    const err = handlerReqErr(error, "warning")
    if (!err) ElMessage.error("发送验证码失败")
  }
}

// 更新的 回调
const handlerUpdate = async () => {
  try {
    await formInstance.value.validate()

    // 更新 数据
    const result = await updateUser(userEditorData)

    // 重新获取信息 在 路由重载后 加载数据
    userInfoByToken(result?.token || "", async () => {
      // 没有 token了 关闭 面板
      if (!result?.token) {
        isShowPanel.value = false
      }
      // 初始化 数据
      initData()
      // 在 微任务后执行
      setTimeout(() => {
        // 清除 验证
        formInstance.value?.clearValidate()
      }, 0)
    })

    ElMessage.success("更新用户信息成功~")
  } catch (error) {
    // 初始化 数据
    initData()
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("更新用户信息失败~")
  }
}

// 更新头像的回调
const updateAvatar = async () => {
  try {
    const uploadAvatar = avatar.value?.[0]?.url

    // 判断是否更新
    if (uploadAvatar === default_avatar) {
      ElMessage.warning("头像没有更新哦~")
      return
    }

    // 存储新的头像地址
    let newAvatar: string | null = uploadAvatar || default_avatar || ""
    // 判断是否更新
    const isUpdate =
      // 不等与 默认图片
      uploadAvatar !== default_avatar &&
      // 不等于 本地图片
      uploadAvatar !== userAvatar.value &&
      // 有值
      uploadAvatar

    // 判断 是否需要删除 原来的图片
    const originAvatar = userAvatar.value

    // 存在 更新的图片 则转为永久 链接
    if (isUpdate) {
      const tempImg = [isUpdate]
      const result = await postImgPermanent({
        tempImg,
        account: userAccount.value,
        path: "/avatar",
      })
      if (result) {
        const { successImg, tempImgNull } = result
        // 临时图片失效的
        if (tempImgNull.length) {
          ElMessage.error("更新用户头像失败")
          return
        }
        // 得到 成功的poster
        const _img = successImg?.[0]?.url
        // 修改 poster
        if (_img) {
          newAvatar = _img
        }
      }
    }
    // 如果是重置的话则 设为null
    if (newAvatar === default_avatar) newAvatar = null
    // 存储token
    let token = userToken.value
    // 更新 头像
    const result = await updateUserAvatar(newAvatar)
    if (result?.token) token = result.token
    // 判断 是否需要删除
    const isRemove = originAvatar
    // 重新获取信息 在 路由重载后 加载数据
    userInfoByToken(token || "", async () => {
      // 需要 更新了 token 后删除 因为 需要 验证
      // 判断 是否需要删除 原来的图片
      if (isRemove) {
        try {
          await removeFileStatic([originAvatar])
        } catch (error) {}
      }
      avatar.value = [{ name: "default", url: avatarInit() }]
    })

    ElMessage.success("更新用户头像成功~")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("更新用户头像失败~")
    avatar.value = [{ name: "default", url: avatarInit() }]
  }
}

// 切换账号的状态
const toggleUserBin = async (isBin: string | null) => {
  // 处理 注销的逻辑
  if (!isBin) {
    try {
      const result = await removeUser()
      ElMessage.success(
        `注销账号成功，过期时间为：${formatMilliseconds(+result)}`
      )
      userIsBin.value = `${new Date()}`
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error(`注销账号失败~`)
    }
    return
  }
  // 处理恢复的逻辑
  try {
    await recoverUser()
    ElMessage.success("恢复账号成功~")
    userIsBin.value = null
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("恢复账号失败~")
  }
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
      gap: 20px;
    }
  }
}
</style>
