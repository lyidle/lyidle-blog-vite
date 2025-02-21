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
            <my-input
              placeholder="请输入svg或项目中用到的iconify的class名(不是必填项)"
              v-model="createData.icon"
            ></my-input>
          </el-form-item>
          <el-form-item label="路径" prop="to">
            <my-input
              placeholder="请输入路径名(需要是异步路由写了的,不是必填项)"
              v-model="createData.to"
            ></my-input>
          </el-form-item>
          <!-- bannerImg -->
          <div class="text-color-[var(--primary-color)] text-center text-20px">
            bannerImg
          </div>
          <el-form-item label="高度" prop="height">
            <my-input
              placeholder="请输入背景高度(不是必填项)"
              v-model="createData.height"
            ></my-input>
          </el-form-item>
          <!-- <el-form-item label="白天" prop="light">
            <my-input
              placeholder="请输入路径名(需要是异步路由写了的,不是必填项)"
              v-model="createData.light"
            ></my-input>

          </el-form-item> -->
          <!-- <el-form-item label="暗夜" prop="dark">
          </el-form-item> -->
          <div class="flex justify-center gap-15px">
            <div class="flex items-center">
              白天:
              <my-upload
                v-model="createData.light"
                :remove="false"
                class="ml-10px"
              ></my-upload>
            </div>
            <div class="flex items-center">
              暗夜:
              <my-upload
                v-model="createData.dark"
                :remove="false"
                class="ml-10px"
              ></my-upload>
            </div>
          </div>
          <!-- Layout -->
          <div class="text-color-[var(--primary-color)] text-center text-20px">
            Layout
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
// 引入api
import { updateMenuList } from "@/api/admin"
// 引入 类型
import type { UpdateMenuListBody } from "@/api/admin/types/updateMenuListBody"
import type { Datum } from "@/api/admin/types/getMenuList"
const centerDialogVisible = ref(false)
const createData = reactive<UpdateMenuListBody>({
  id: -1,
  name: "",
  roles: [],
  parentId: null,
  // bannerImg
  height: "",
  light: "",
  dark: "",
  // Layout
  // 宽度
  topnavWidth: "",
  // 方向
  topnavDirection: "",
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
const init = (row: Datum) => {
  centerDialogVisible.value = true
  // 克隆一下
  const _row = JSON.parse(JSON.stringify(row))
  // 基础的赋值
  Object.assign(createData, _row)
  // bannerImg
  createData.height = _row.bannerImg?.height
  createData.light = _row.bannerImg?.light
  createData.dark = _row.bannerImg?.dark
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
    // bannerImg
    createData.bannerImg = {
      height: createData.height,
      light: createData.light,
      dark: createData.dark,
    }
    // Layout
    createData.layout = {
      topnavWidth: createData.topnavWidth,
      topnavDirection: createData.topnavDirection,
    }
    console.log(createData)
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
