// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { findAllPermissionsPagination } from "@/api/admin"
// 引入 类型
import type { Pagination } from "@/api/admin/types/findAllRolesPagination"
import { Permission } from "@/api/admin/types/findAllPermissionsPagination"
export const useMangerPermissionsBase = (searchKey: Ref<string>) => {
  // 头部的按钮大小
  const headerBtnsSize = ref("default")

  // 搜索回调
  const handlerSearch = async (key: string) => {
    try {
      const result = await findAllPermissionsPagination({ name: key })
      // 保存 key
      searchKey.value = key
      tableData.value = result.permission
      pagination.value = result.pagination
      ElMessage.success("搜索成功~")
    } catch (error) {}
  }

  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    await reqAllRoles()
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
  const tableData = ref<Permission[]>([])
  const pagination = ref<Pagination>()

  // pagination  的回调
  // 获取用户
  const reqAllRoles = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const result = await findAllPermissionsPagination({
        currentPage,
        pageSize,
      })
      tableData.value = result.permission
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
    handlerReset,
  }
}
