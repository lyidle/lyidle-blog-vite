// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { findALlRolesPagination } from "@/api/admin"
// 引入 类型
import type { Pagination, Role } from "@/api/admin/types/findAllRolesPagination"
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
  const tableData = ref<Role[]>([])
  const pagination = ref<Pagination>()

  // pagination  的回调
  // 获取用户
  const reqAllRoles = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const result = await findALlRolesPagination({ currentPage, pageSize })
      tableData.value = result.roles
      pagination.value = result.pagination
    } catch (error) {}
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)
  onMounted(async () => {
    // 得到 用户
    await reqAllRoles()
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
    reqAllRoles,
  }
}
