<template>
  <my-drawer v-model="drawer" width="250px" name="manager-drawer">
    <template #body>
      <div class="text-[20px]">分配角色</div>
      <el-form class="mt-20px" label-width="70" label-position="left">
        <el-form-item class="!mb-10px" label="账号">
          <my-input placeholder="账号" v-model="nickName" disabled></my-input>
        </el-form-item>
        <el-form-item class="!mb-10px" label="用户名">
          <my-input placeholder="用户名" v-model="account" disabled></my-input>
        </el-form-item>
        <el-form-item class="!mb-10px" label="角色列表">
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
      <div class="flex">
        <my-button type="default" @click="drawer = false">取消</my-button>
        <my-button @click="handlerConfirm">提交</my-button>
      </div>
    </template>
  </my-drawer>
</template>

<script setup lang="ts" name="UserAssignRoles">
import { findAllRoles } from "@/api/admin"
import { setUserRoles } from "@/api/user"
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
// 当前用户
const currentUser = ref<User>()
const nickName = computed(() => {
  return currentUser.value?.nickName
})
const account = computed(() => {
  return currentUser.value?.account
})
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
const init = async (row: User) => {
  drawer.value = true
  const result = await findAllRoles()
  const roles = result.map((item) => item.name)
  // 初始化输入框
  currentUser.value = row
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
// 夫组件的自定义事件
const emit = defineEmits<{
  req: []
}>()

// 提交
const handlerConfirm = async () => {
  try {
    await setUserRoles({
      id: currentUser.value?.id as number,
      roles: checkedRoles.value,
    })
    // 重新请求
    await emit("req")
    drawer.value = false
    ElMessage.success("分配用户的角色成功~")
  } catch (error) {}
}

defineExpose({ init })
</script>

<style scoped></style>
