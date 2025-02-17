<template>
  <my-card class="admin-search card_style" bg="var(--manager-card-bg)">
    <el-form inline @submit.prevent="submit && submit(searchKey)">
      <el-form-item :label="label">
        <div class="searchContainer">
          <el-input
            :placeholder
            :size
            class="search"
            :style="{ width: inputSize }"
            v-model="searchKey"
          />
          <div class="btns">
            <my-button
              native-type="submit"
              class="ml-[var(--admin-content-header-gap)]"
              :size
              >搜索</my-button
            >
            <my-button
              class="!ml-[var(--admin-content-header-gap)]"
              :size
              plain
              @click="handlerRest"
              >重置</my-button
            >
          </div>
        </div>
      </el-form-item>
    </el-form>
  </my-card>
</template>

<script setup lang="ts" name="SearchAdmin">
import { mitt } from "@/utils/emitter"

const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    submit?: (key: string) => void
    reset?: () => void
  }>(),
  {
    label: "搜索key：",
    placeholder: "搜索placeholder",
  }
)

// 搜索的关键字
const searchKey = ref()
// input和button的大小
const size = ref()
// input 的宽度
const inputSize = ref()

// 重置
const handlerRest = () => {
  searchKey.value = ""
  props.reset?.()
}
// 处理 窗口变化 的事件
const handlerResize = () => {
  if (window.innerWidth > 870) {
    // input和button的大小
    size.value = "default"
    inputSize.value = "200px"
    return
  }
  // input和button的大小
  size.value = "small"
  inputSize.value = "100px"
}

// 监听窗口变化
mitt.on("window:resize", handlerResize)

onMounted(async () => {
  // 处理 窗口变化 的事件
  handlerResize()
})

onBeforeUnmount(() => {
  // 卸载监听窗口变化
  mitt.off("window:resize", handlerResize)
})
</script>

<style lang="scss">
.admin-search {
  .el-form-item__label {
    font-size: 1rem;
    color: inherit;
  }
}
</style>
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
