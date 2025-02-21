<template>
  <my-drawer v-model="drawer" width="250px" name="manager-drawer">
    <template #body>
      <div class="text-[20px]">分配权限</div>
      <el-form class="mt-20px" label-width="70" label-position="right">
        <el-form-item class="!mb-10px" label="名字">
          <my-input v-model="name" disabled></my-input>
        </el-form-item>
        <el-form-item class="!mb-10px" label="描述">
          <my-input v-model="desc" disabled></my-input>
        </el-form-item>
        <el-form-item class="!mb-10px" label="权限列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            class="!mr-30px"
          >
            Check all
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedPermissions"
            @change="handleCheckedPermissionsChange"
          >
            <el-checkbox
              v-for="city in Permissions"
              :key="city"
              :label="city"
              :value="city"
            >
              {{ city }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="flex">
        <my-button type="default" @click="drawer = false">取消</my-button>
        <my-button @click="handlerConfirm">提交</my-button>
      </div>
    </template>
  </my-drawer>
</template>

<script setup lang="ts" name="GroupAssignPermissions">
// 引入 api
import { findAllPermissions, managerSetGroupPermissions } from "@/api/admin"
// 引入 类型
import type { CheckboxValueType } from "element-plus"
import type { Group } from "@/api/admin/types/findAllGroupsPagination"
// drawer是否显示
const drawer = ref<boolean>(false)
// 选中的数据
const checkedPermissions = ref<string[]>([])
// 全部的roles
const Permissions = ref<string[]>([])
// 中间态
const isIndeterminate = ref(false)
// 当前用户
const currentRole = ref<Group>()
const name = computed(() => {
  return currentRole.value?.name
})
const desc = computed(() => {
  return currentRole.value?.desc
})

// 全选状态
const checkAll = ref(false)

// 全选中状态变化
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedPermissions.value = val ? Permissions.value : []
  isIndeterminate.value = false
}

// 选中状态变化
const handleCheckedPermissionsChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === Permissions.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < Permissions.value.length
}

// 得到 所有的权限信息
const init = async (row: Group) => {
  const _row = JSON.parse(JSON.stringify(row)) as Group
  drawer.value = true
  const result = await findAllPermissions()
  const roles = result.map((item) => item.name)
  // 初始化权限信息
  currentRole.value = _row
  // 初始化权限
  Permissions.value = roles
  // 赋值选中的数据
  checkedPermissions.value = _row.children.map((item) => item.name)
  // 初始化中间态
  isIndeterminate.value =
    checkedPermissions.value.length > 0 &&
    checkedPermissions.value.length < Permissions.value.length
  // 初始化 全选框
  checkAll.value = checkedPermissions.value.length === Permissions.value.length
}

// 夫组件的自定义事件
const emit = defineEmits<{
  req: []
}>()

// 提交
const handlerConfirm = async () => {
  try {
    // 设置 权限组的权限
    await managerSetGroupPermissions({
      id: currentRole.value?.id as number,
      permissions: checkedPermissions.value,
    })
    // 重新请求
    await emit("req")
    drawer.value = false
    ElMessage.success("分配权限组的权限成功~")
  } catch (error) {}
}

defineExpose({ init })
</script>

<style scoped></style>
