<template>
  <my-drawer v-model="drawer" width="250px" name="manager-drawer">
    <template #body>
      <div class="text-[20px]">分配权限组</div>
      <el-form class="mt-20px" label-width="85" label-position="right">
        <el-form-item class="!mb-10px" label="名字">
          <my-input v-model="name" disabled></my-input>
        </el-form-item>
        <el-form-item class="!mb-10px" label="描述">
          <my-input v-model="desc" disabled></my-input>
        </el-form-item>
        <el-form-item class="!mb-10px" label="权限组列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            class="!mr-30px"
          >
            Check all
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedRoles"
            @change="handleCheckedRolesChange"
          >
            <el-checkbox
              v-for="group in Groups"
              :key="group"
              :label="group"
              :value="group"
            >
              {{ group }}
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

<script setup lang="ts" name="RoleAssignGroup">
// 引入 api
import { findAllGroups, managerSetRoleGroups } from "@/api/admin"
// 引入 类型
import { Role } from "@/api/admin/types/findAllRolesPagination"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

import type { CheckboxValueType } from "element-plus"
// drawer是否显示
const drawer = ref<boolean>(false)
// 选中的数据
const checkedRoles = ref<string[]>([])
// 全部的 groups
const Groups = ref<string[]>([])
// 中间态
const isIndeterminate = ref(false)
// 当前用户
const currentRole = ref<Role>()
const name = computed(() => {
  return currentRole.value?.name || ""
})
const desc = computed(() => {
  return currentRole.value?.desc || ""
})

// 全选状态
const checkAll = ref(false)

// 全选中状态变化
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedRoles.value = val ? Groups.value : []
  isIndeterminate.value = false
}

// 选中状态变化
const handleCheckedRolesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === Groups.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < Groups.value.length
}

// 得到 所有的权限组信息
const init = async (row: Role) => {
  const _row = JSON.parse(JSON.stringify(row)) as Role
  drawer.value = true
  const result = await findAllGroups()
  const roles = result.map((item) => item.name)
  // 初始化权限组信息
  currentRole.value = _row
  // 初始化权限组
  Groups.value = roles
  // 赋值选中的数据
  checkedRoles.value = _row.PermissionGroups.map((item) => item.name)
  // 初始化中间态
  isIndeterminate.value =
    checkedRoles.value.length > 0 &&
    checkedRoles.value.length < Groups.value.length
  // 初始化 全选框
  checkAll.value = checkedRoles.value.length === Groups.value.length
}
// 夫组件的自定义事件
const emit = defineEmits<{
  (e: "req", stay?: boolean): []
}>()

// 提交
const handlerConfirm = async () => {
  try {
    // 设置 权限组的权限组
    await managerSetRoleGroups({
      id: currentRole.value?.id as number,
      groups: checkedRoles.value,
    })
    // 重新请求
    emit("req", true)
    drawer.value = false
    ElMessage.success("分配权限组的权限组成功~")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("分配权限组的权限组失败~")
  }
}

defineExpose({ init })
</script>

<style scoped lang="scss">
::v-deep(.el-checkbox__label) {
  color: var(--primary-color);
}
</style>
