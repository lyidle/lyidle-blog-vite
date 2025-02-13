<template>
  <div class="admin-container">
    <my-search-admin :submit="handlerSearch"> </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg)">
      <div class="admin-header-btns">
        <my-button>添加用户</my-button>
        <my-button>批量删除</my-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="width" />
        <el-table-column prop="name" label="Name" width="width" />
        <el-table-column prop="address" label="Address" width="width" />
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminAccessRoles">
const tableData = ref([])
// 搜索回调
const handlerSearch = () => {
  ElMessage("test11")
}
</script>

<style scoped lang="scss">
.admin-container {
  display: flex;
  flex-direction: column;
  gap: var(--admin-content-card-gap);
  @include adminHeaderBtns;
  .admin-content {
    padding: var(--admin-content-card-pd);
  }
}
</style>
