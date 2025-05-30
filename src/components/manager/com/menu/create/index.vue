<template>
  <teleport to="body">
    <el-dialog
      class="primary-dialog"
      v-model="centerDialogVisible"
      width="500"
      align-center
      draggable
      @close="handlerClose"
    >
      <template #header>
        <div class="color-[var(--primary-color)]">创建菜单</div>
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
            placeholder="请输入子菜单名"
            v-model="createData.name"
          ></my-input>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <my-tags
            v-model="createData.roles"
            min="0"
            max="5"
            error="标签个数需要在0-5之间"
            ref="tagsInstance"
            class="mr-10px"
            left="10px"
          ></my-tags>
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
  </teleport>
</template>

<script setup lang="ts" name="MenuCreate">
// 引入api
// 引入 类型
import type { Datum } from "@/api/admin/types/getMenuList"
import type { CreateMenuListBody } from "@/api/admin/types/createMenuListBody"
import { createMenuList } from "@/api/admin"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
const centerDialogVisible = ref(false)

const createData = reactive<CreateMenuListBody>({
  name: "",
  roles: [],
  parentId: null,
})

// 创建规则
const createRules = reactive({
  name: [
    { required: true, trigger: "change", message: "菜单名是必填项" },
    {
      required: true,
      trigger: "change",
      min: 1,
      max: 32,
      message: "菜单名字长度必须在1-32之间哦",
    },
  ],
})

// 初始化
const init = (row: Datum) => {
  centerDialogVisible.value = true
  // 有 传递数据
  if (row) {
    const _row = JSON.parse(JSON.stringify(row))
    createData.parentId = _row.id
    createData.roles = _row.roles
  }
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
  (e: "req", stay?: boolean): []
}>()

// 确认
const handlerConfirm = async () => {
  try {
    // 表单校验
    await formInstance.value.validate()
    // 触发 tags的验证
    tagsInstance.value.validate?.()
    await createMenuList(createData)
    ElMessage.success(`创建菜单成功~`)
    centerDialogVisible.value = false
    // 重新请求
    emit("req", true)
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("创建菜单失败~")
  }
}

// 暴露
defineExpose({ init })
</script>
