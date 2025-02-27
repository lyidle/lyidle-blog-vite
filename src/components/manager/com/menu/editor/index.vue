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
          <div class="color-[var(--primary-color)]">编辑菜单</div>
        </template>
        <el-form
          :model="createData"
          :rules="createRules"
          label-position="right"
          label-width="60"
          ref="formInstance"
          @submit.prevent="handlerConfirm"
        >
          <el-form-item label="菜单名" prop="name">
            <my-input
              placeholder="请输入菜单名"
              v-model="createData.name"
            ></my-input>
          </el-form-item>
          <el-form-item label="权限" prop="roles">
            <my-tags
              v-model="createData.roles"
              min="0"
              max="5"
              error="标签个数需要在0-5之间哦~"
              ref="tagsInstance"
              class="mr-10px"
              left="10px"
            ></my-tags>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-tooltip
              effect="dark"
              content="请输入svg或本地的iconify的class名亦或者是database图片需要以[background:]开头(不是必填项)"
              placement="top"
            >
              <my-input
                placeholder="请输入svg或本地的iconify的class名亦或者是database图片需要以[background:]开头(不是必填项)"
                v-model="createData.icon"
              ></my-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="路径" prop="to">
            <my-input
              placeholder="请输入路径名(需要是异步路由写了的,不是必填项)"
              v-model="createData.to"
            ></my-input>
          </el-form-item>
          <!-- Layout -->
          <div
            class="text-color-[var(--primary-color)] text-center text-20px mt-10px"
          >
            布局
          </div>
          <el-form-item label="宽度" prop="topnavWidth">
            <my-input
              placeholder="请输入菜单的宽度(不是必填项)"
              v-model="createData.topnavWidth"
            ></my-input>
          </el-form-item>
          <el-form-item label="方向" prop="topnavDirection">
            <my-input
              placeholder="请输入菜单的方向(不是必填项)"
              v-model="createData.topnavDirection"
            ></my-input>
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

<script setup lang="ts" name="MenuEditor">
// 引入 类型
import type { UpdateMenuListBody } from "@/api/admin/types/updateMenuListBody"
import type { Datum } from "@/api/admin/types/getMenuList"
// 引入正则
import { isValidCSSUnitReg } from "@/RegExp/Css/isValidCSSUnit "
import { urlReg } from "@/RegExp/Url/isUrl"
// 引入 api
import { updateMenuList } from "@/api/admin"

const centerDialogVisible = ref(false)
const createData = reactive<UpdateMenuListBody>({
  id: -1,
  name: "",
  icon: "",
  to: "",
  roles: [],
  parentId: null,
  // Layout
  // 宽度
  topnavWidth: "",
  // 方向
  topnavDirection: "",
})

// 验证 icon
const iconValidator = (rule: any, value: any, callback: any) => {
  const isBg = value?.startsWith("background:")
  // 是 database 图标
  if (isBg) {
    const bg = value.split("background:")[1]
    if (urlReg.test(bg)) {
      // 如果匹配 URL 正则表达式，则验证失败
      callback(new Error("database图标不能是一个外链哦~"))
    } else {
      // 否则验证通过
      callback()
    }
  }
  if (urlReg.test(value)) {
    // 如果匹配 URL 正则表达式，则验证失败
    callback(new Error("不能是一个外链哦~"))
  } else {
    // 否则验证通过
    callback()
  }
}

// 创建规则
const createRules = reactive({
  name: [
    { required: true, trigger: "change", message: "菜单名是必填项哦~" },
    {
      required: true,
      trigger: "change",
      min: 1,
      max: 32,
      message: "菜单名字长度必须在1-32之间哦~",
    },
  ],
  icon: [
    {
      trigger: "change",
      validator: iconValidator, // 使用自定义验证函数
    },
  ],
  // 菜单的宽度
  topnavWidth: [
    {
      trigger: "change",
      pattern: isValidCSSUnitReg,
      message: "菜单的宽度，请输入一个正常的css单位信息~",
    },
  ],
  // 菜单的方向
  topnavDirection: [
    {
      trigger: "change",
      pattern: /left|right/,
      message: "菜单方向为left或right哦~",
    },
  ],
})

// 初始化
const init = (row: Datum) => {
  centerDialogVisible.value = true
  // 克隆一下
  const _row = JSON.parse(JSON.stringify(row))
  // 基础的赋值
  Object.assign(createData, _row)
  // Layout
  createData.topnavWidth = _row.layout?.topnavWidth
  createData.topnavDirection = _row.layout?.topnavDirection
}

// 表单组件实例
const formInstance = ref()
// tags组件实例
const tagsInstance = ref()

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
    // 触发 tags的验证
    tagsInstance.value.validate?.()
    // 整理数据
    const updateData = {
      id: createData.id,
      name: createData.name,
      icon: createData.icon,
      to: createData.to,
      roles: createData.roles,
      parentId: createData.parentId,
      // bannerImg
      bannerImg: {
        height: createData.height,
        light: createData.light?.[0]?.url,
        dark: createData.dark?.[0]?.url,
      },
      // Layout
      layout: {
        topnavWidth: createData.topnavWidth,
        topnavDirection: createData.topnavDirection,
      },
    }
    await updateMenuList(updateData)
    ElMessage.success(`修改菜单成功~`)
    centerDialogVisible.value = false
    // 重新请求
    await emit("req")
  } catch (error) {}
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
