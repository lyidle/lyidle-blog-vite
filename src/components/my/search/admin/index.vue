<template>
  <my-card class="admin-search card_style" bg="var(--manager-card-bg)">
    <el-form inline @submit.prevent="submit && submit(searchKey)">
      <div class="flex gap-20px flex-wrap">
        <div class="searchContainer flex items-center">
          <span
            class="cur-text"
            :style="{ fontSize: isSmall ? '13px' : '16px' }"
            >{{ label }}</span
          >
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
              type="default"
              @click="handlerRest"
              >重置</my-button
            >
            <slot name="item"></slot>
          </div>
        </div>
        <slot></slot>
      </div>
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
const isSmall = ref(false)
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
    isSmall.value = false
    return
  }
  // input和button的大小
  size.value = "small"
  inputSize.value = "100px"
  isSmall.value = true
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
  position: relative;
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
