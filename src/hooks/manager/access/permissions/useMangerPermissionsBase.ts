// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { findAllPermissionsPagination } from "@/api/admin"
// 引入 类型
import type { Pagination } from "@/api/admin/types/findAllRolesPagination"
import type { Permission } from "@/api/admin/types/findAllPermissionsPagination"
import type { OrdinarySearchQuery } from "@/api/types/ordinarySearchQuery"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
export const useMangerPermissionsBase = (searchKey: Ref<string>) => {
  // 当前页
  const currentPage = ref(1)
  // 分页器个数
  const pageSize = ref(10)
  // 搜索回调
  const handlerSearch = async (key: string) => {
    // 设置搜索需要的
    searchKey.value = key
    currentPage.value = 1
    await reqAllRoles()
  }

  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    currentPage.value = 1
    await reqAllRoles()
  }

  // 头部 搜索 按钮大小
  const headerBtnsSize = ref<string>()
  // 账号和用户名的 宽度
  const accountsWidth = ref<number>()
  // 右侧 工具栏
  const toolBtnsWidth = ref<number>()
  // 处理 窗口变化 的事件
  const handlerResize = () => {
    if (window.innerWidth > 870) {
      accountsWidth.value = 150
      headerBtnsSize.value = "default"
      toolBtnsWidth.value = 290

      return
    }
    accountsWidth.value = 100
    headerBtnsSize.value = "small"
    toolBtnsWidth.value = 100
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
      const search = { currentPage, pageSize } as OrdinarySearchQuery
      // 如果搜索了 则按照搜索的来
      if (searchKey) search.name = searchKey.value
      const result = await findAllPermissionsPagination(search)
      tableData.value = result.permission
      pagination.value = result.pagination
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询权限失败~")
    }
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
    tableData,
    pagination,
    reqAllRoles,
    handlerReset,
    currentPage,
    pageSize,

    headerBtnsSize,
    accountsWidth,
    toolBtnsWidth,
  }
}
