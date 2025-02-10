<template>
  <my-card class="admin-search card_style" bg="var(--manager-card-bg)">
    <el-form inline>
      <el-form-item :label="searchKey">
        <el-input :placeholder clearable />
      </el-form-item>
      <div class="btns">
        <my-button>搜索</my-button>
        <my-button>重置</my-button>
      </div>
    </el-form>
  </my-card>
</template>

<script setup lang="ts" name="SearchAdmin">
withDefaults(defineProps<{ searchKey?: string; placeholder?: string }>(), {
  searchKey: "搜索key：",
  placeholder: "搜索placeholder",
})
</script>

<style scoped lang="scss">
.admin-search {
  .el-form-item {
    margin-bottom: 0;
  }
  .btns {
    display: flex;
  }
}
</style>
