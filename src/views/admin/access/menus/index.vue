<template>
  <div class="admin-container">
    <my-search-admin :submit="handlerSearch"> </my-search-admin>
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="admin-header-btns">
        <my-button
          :size="headerBtnsSize"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          >添加用户</my-button
        >
        <my-button
          :size="headerBtnsSize"
          type="danger"
          :style="`${headerBtnsSize === 'small' && 'width: 80px'}`"
          >批量删除</my-button
        >
      </div>
      <my-tree :data="tree" @node-click="handlerClick"></my-tree>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminAccessUsers">
import { mitt } from "@/utils/emitter"
import { Tree } from "@/components/my/tree/types"
// 头部 搜索 按钮大小
const headerBtnsSize = ref("default")
// 账号和用户名的 宽度
const accountsWidth = ref(130)

// 搜索回调
const handlerSearch = (key: string) => {
  ElMessage(key)
}

// 处理 窗口变化 的事件
const handlerResize = () => {
  if (window.innerWidth > 870) {
    // 账号和用户名的 宽度
    accountsWidth.value = 130
    headerBtnsSize.value = "default"
    return
  }
  // 账号和用户名的 宽度
  accountsWidth.value = 70
  headerBtnsSize.value = "small"
}

// 监听窗口变化
mitt.on("window:resize", handlerResize)

import { useUserStore } from "@/store/user"
import { GetMenuList } from "@/api/admin/types/getMenuList"
const { userMenuList } = storeToRefs(useUserStore())

// 把数据 处理成组件 需要的数据
const tree = computed(() => {
  const recur = (menu: GetMenuList["data"]) => {
    return menu?.map((item) => {
      const result = { label: item.name, children: [] } as Tree
      if (item.children) {
        const children = recur(item.children)
        if (children?.length) {
          result.children = children
        }
      }
      return result
    })
  }
  return recur(userMenuList.value)
})

const handlerClick = (v: any) => {
  console.log(v)
}
// pagination  的回调
// 获取用户
const reqUsers = async (currentPage: number = 1, pageSize: number = 10) => {
  try {
    // const result = await searchExactUser({ currentPage, pageSize })
    // tableData.value = result?.users || []
    // pagination.value = result?.pagination
  } catch (error) {}
}

onMounted(async () => {
  // 得到 用户
  await reqUsers()
  // 处理 窗口变化 的事件
  handlerResize()
})

onBeforeUnmount(() => {
  // 卸载监听窗口变化
  mitt.off("window:resize", handlerResize)
})
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
