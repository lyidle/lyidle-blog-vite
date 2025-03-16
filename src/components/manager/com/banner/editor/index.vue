<template>
  <teleport to="body">
    <el-dialog
      class="manager-dialog"
      v-model="centerDialogVisible"
      width="500"
      align-center
      draggable
      @close="handlerClose"
    >
      <template #header>
        <div class="color-[var(--primary-color)]">编辑背景</div>
      </template>
      <el-form
        :model="createData"
        :rules="editorRules"
        label-position="left"
        label-width="60"
        ref="formInstance"
        @submit.prevent="handlerConfirm"
      >
        <el-form-item label="高度" prop="height">
          <my-input
            placeholder="请输入高度"
            v-model="createData.height"
          ></my-input>
        </el-form-item>
        <!-- bannerImg -->
        <div
          class="text-color-[var(--primary-color)] text-center text-20px mt-20px"
        >
          背景
        </div>
        <div class="flex justify-between mt-20px">
          <div class="flex items-center">
            白天:
            <my-upload
              v-model="light"
              :auto-remove="false"
              class="ml-10px"
            ></my-upload>
          </div>
          <div class="flex items-center mr-10px hidden">
            暗夜:
            <my-upload
              v-model="dark"
              :auto-remove="false"
              class="ml-10px"
            ></my-upload>
          </div>
        </div>
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

<script setup lang="ts" name="BannerEditor">
// 引入 接口
// 引入 类型
import type { UpdateBannerImg } from "@/api/admin/types/updateBannerImg"
import type { UploadUserFile } from "element-plus"
// 引入验证
import { isValidCSSUnitReg } from "@/RegExp/Css/isValidCSSUnit "
import { managerPostImgPermanent, removeFileStatic } from "@/api/img"
import { managerUpdateBannerImg } from "@/api/admin"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

const centerDialogVisible = ref(false)

const createData = reactive<UpdateBannerImg>({
  id: -1,
  dark: "",
  light: "",
  height: "",
})

// 存储 上传的图片
const dark = ref<UploadUserFile[]>([])
const light = ref<UploadUserFile[]>([])

// 编辑规则
const editorRules = reactive({
  // bannerImg 的高度
  height: [
    {
      trigger: "change",
      pattern: isValidCSSUnitReg,
      message: "菜单的宽度，请输入一个正常的css单位信息~",
    },
  ],
})

// 处理编辑
const init = (row: UpdateBannerImg) => {
  centerDialogVisible.value = true
  const _row = JSON.parse(JSON.stringify(row))
  if (_row?.light) {
    light.value = [{ name: "default", url: _row?.light }]
  }
  if (_row?.dark) {
    dark.value = [{ name: "default", url: _row?.dark }]
  }
  Object.assign(createData, _row)
  createData.light = _row?.light
  createData.dark = _row?.dark
}

// 表单实例
const formInstance = ref()

// 关闭
const handlerClose = () => {
  formInstance.value.resetFields()
  light.value = []
  dark.value = []
}

// 夫组件的自定义事件
const emit = defineEmits<{
  req: []
}>()

// 构建映射
const StartWithMap = {
  light: "白天",
  dark: "暗夜",
}

// 处理 图片
const updateImg = async (
  startWith: "light" | "dark" = "light",
  url: string | undefined
): Promise<boolean> => {
  // 没有的话置空
  if (!url) {
    createData[startWith] = ""
    return true
  }
  const tempImg = [url]
  const result = await managerPostImgPermanent({
    tempImg,
    // 存储到 /banner/light或dark/id 下
    account: "/banner",
    path: `/${startWith}/${createData.id}`,
  })
  if (result) {
    const { successImg, tempImgNull } = result
    // 临时图片失效的
    if (tempImgNull.length) {
      ElMessage.error(`${StartWithMap[startWith]}的图片更新失败`)
    }
    // 得到 成功的 img
    const _img = successImg?.[0]?.url
    // 修改 img
    if (_img) {
      createData[startWith] = _img
      return true
    }
  }
  return false
}

// 确认
const handlerConfirm = async () => {
  try {
    // 表单校验
    await formInstance.value.validate()

    // 得到 原图
    const originLight = createData.light
    const originDark = createData.dark
    // 处理 图片
    const updateLight = light.value?.[0]?.url
    const updateDark = dark.value?.[0]?.url

    // 处理 白天的 图片
    let isUpdateLight = await updateImg("light", updateLight)
    let isUpdateDark = await updateImg("dark", updateDark)

    // 更新背景信息
    await managerUpdateBannerImg(createData)

    // 判断 是否删除了原图
    if (isUpdateLight && originLight) {
      try {
        await removeFileStatic([originLight])
      } catch (error) {}
    }
    // 判断 是否删除了原图
    if (isUpdateDark && originDark) {
      try {
        await removeFileStatic([originDark])
      } catch (error) {}
    }

    ElMessage.success("修改背景信息成功~")
    centerDialogVisible.value = false
    // 重新请求
    await emit("req")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("修改背景图失败~")
  }
}
// 暴露
defineExpose({ init })
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
