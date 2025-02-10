<template>
  <my-card class="admin-search card_style" bg="var(--manager-card-bg)">
    <el-form inline @submit.prevent="submit">
      <el-form-item :label="searchLabel">
        <div class="searchContainer">
          <el-input :placeholder class="search" v-model="searchKey" />
          <div class="btns">
            <my-button
              native-type="submit"
              class="ml-[var(--admin-content-header-gap)]"
              >搜索</my-button
            >
            <my-button
              class="!ml-[var(--admin-content-header-gap)]"
              @click="searchKey = ''"
              plain
              >重置</my-button
            >
          </div>
        </div>
      </el-form-item>
    </el-form>
  </my-card>
</template>

<script setup lang="ts" name="SearchAdmin">
const searchKey = ref()
withDefaults(
  defineProps<{
    searchLabel?: string
    placeholder?: string
    submit?: () => void
  }>(),
  {
    searchLabel: "搜索key：",
    placeholder: "搜索placeholder",
    submit: () => {
      ElMessage("test")
    },
  }
)
</script>

<style scoped lang="scss">
.admin-search {
  padding: var(--admin-content-card-pd);
  .el-form-item {
    margin-bottom: 0;
  }
  .searchContainer {
    display: flex;
    .search {
      width: 200px;
    }
  }
  .btns {
    display: flex;
  }
}
</style>
