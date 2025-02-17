<template>
  <my-drawer v-model="drawer" width="250px" name="manager-drawer">
    <template #body>
      <div class="text-[20px]">分配角色</div>
      <el-form class="mt-20px">
        <el-form-item class="!mb-10px" label="用户用户名">
          <my-input placeholder="用户姓名" v-model="currentUser"></my-input>
        </el-form-item>
        <el-form-item class="!mb-10px" label="用户列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            Check all
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedRoles"
            @change="handleCheckedRolesChange"
          >
            <el-checkbox
              v-for="city in Roles"
              :key="city"
              :label="city"
              :value="city"
            >
              {{ city }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
  </my-drawer>
</template>

<script setup lang="ts" name="UserAssignRoles">
import { findALlRoles } from "@/api/admin"
import { User } from "@/api/user/types/searchUserPagination"
import type { CheckboxValueType } from "element-plus"
// drawer是否显示
const drawer = ref<boolean>(false)
// 选中的数据
const checkedRoles = ref<string[]>([])
// 全部的roles
const Roles = ref<string[]>([])
// 中间态
const isIndeterminate = ref(false)
const currentUser = ref<string>()
// 全选状态
const checkAll = ref(false)

// 全选中状态变化
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedRoles.value = val ? Roles.value : []
  isIndeterminate.value = false
}

// 选中状态变化
const handleCheckedRolesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === Roles.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < Roles.value.length
}

// 得到 所有的角色信息
const initDrawer = async (row: User) => {
  drawer.value = true
  const result = await findALlRoles()
  const roles = result.map((item) => item.name)
  // 初始化输入框
  currentUser.value = row.nickName
  // 初始化角色
  Roles.value = roles
  // 赋值选中的数据
  checkedRoles.value = row.roles
  // 初始化中间态
  isIndeterminate.value =
    checkedRoles.value.length > 0 &&
    checkedRoles.value.length < Roles.value.length
  // 初始化 全选框
  checkAll.value = checkedRoles.value.length === Roles.value.length
}

defineExpose({ initDrawer })
</script>

<style scoped></style>
