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
          <div class="color-[var(--primary-color)]">创建权限</div>
        </template>
        <el-form
          :model="createData"
          :rules="createRules"
          label-position="right"
          label-width="60"
          ref="formInstance"
          @submit.prevent="handlerConfirm"
        >
          <el-form-item label="权限名" prop="name">
            <my-input
              placeholder="请输入权限名"
              v-model="createData.name"
            ></my-input>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <my-input
              placeholder="请输入描述"
              v-model="createData.desc"
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

<script setup lang="ts" name="PermissionEditor">
// 引入 接口
import { managerUpdatePermission } from "@/api/admin"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
// 引入 类型
import type { UpdateRoleBody } from "@/api/admin/types/updateRoleBody"

const centerDialogVisible = ref(false)

const createData = reactive<UpdateRoleBody>({
  id: -1,
  name: "",
  desc: "",
})

// 创建规则
const createRules = reactive({
  name: [
    { required: true, trigger: "change", message: "权限名是必填项" },
    {
      required: true,
      trigger: "change",
      min: 1,
      max: 32,
      message: "权限名字长度必须在1-32之间哦",
    },
  ],
  desc: [
    {
      trigger: "change",
      min: 0,
      max: 255,
      message: "权限描述长度必须要在0-32之间哦",
    },
  ],
})

// 初始化
const init = (row: UpdateRoleBody) => {
  centerDialogVisible.value = true
  Object.assign(createData, JSON.parse(JSON.stringify(row)))
}

// 表单实例
const formInstance = ref()

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
    await managerUpdatePermission(createData)
    ElMessage.success(`修改权限成功~`)
    centerDialogVisible.value = false
    // 重新请求
    await emit("req")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("修改权限失败~")
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
