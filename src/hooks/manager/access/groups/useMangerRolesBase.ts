// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { findAllGroupsPagination } from "@/api/admin"
// 引入 类型
import type { Pagination } from "@/api/admin/types/findAllRolesPagination"
import type { Group } from "@/api/admin/types/findAllGroupsPagination"
export const useMangerRolesBase = () => {
  // 头部的按钮大小
  const headerBtnsSize = ref("default")

  // 搜索回调
  const handlerSearch = (key: string) => {
    ElMessage(key)
  }

  // 处理 窗口变化 的事件
  const handlerResize = () => {
    if (window.innerWidth > 870) {
      // 头部的按钮大小
      headerBtnsSize.value = "default"
      return
    }
    // 头部的按钮大小
    headerBtnsSize.value = "small"
  }

  // 表格的数据
  const tableData = ref<Group[]>([])
  const pagination = ref<Pagination>()

  // pagination  的回调
  // 获取权限组
  const reqAllGroups = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const result = await findAllGroupsPagination({ currentPage, pageSize })
      tableData.value = result.groups
      pagination.value = result.pagination
    } catch (error) {}
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)
  onMounted(async () => {
    // 得到 用户
    await reqAllGroups()
    // 处理 窗口变化 的事件
    handlerResize()
  })

  onBeforeUnmount(() => {
    // 卸载监听窗口变化
    mitt.off("window:resize", handlerResize)
  })

  return {
    handlerSearch,
    headerBtnsSize,
    tableData,
    pagination,
    reqAllGroups,
  }
}
