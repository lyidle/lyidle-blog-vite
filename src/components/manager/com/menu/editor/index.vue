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
              placeholder="请输入菜单名"
              v-model="createData.name"
            ></my-input>
          </el-form-item>
          <el-form-item label="权限" prop="role">
            <my-tags
              v-model="createData.roles"
              min="1"
              max="5"
              error="标签个数需要在0-5之间哦~"
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
    </my-context-menu>
  </teleport>
</template>

<script setup lang="ts" name="MenuEditor">
// 引入 类型
import { updateMenuList } from "@/api/admin"
import type { UpdateMenuListBody } from "@/api/admin/types/updateMenuListBody"
const centerDialogVisible = ref(false)
const createData = reactive<UpdateMenuListBody>({
  id: -1,
  name: "",
  roles: [],
  parentId: null,
})

// 创建规则
const createRules = reactive({
  name: [
    { required: true, trigger: "change", message: "菜单名是必填项哦~" },
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
const init = (row: UpdateMenuListBody) => {
  centerDialogVisible.value = true
  Object.assign(createData, JSON.parse(JSON.stringify(row)))
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
    tagsInstance.value.validate?.()
    // await updateMenuList(createData)
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
