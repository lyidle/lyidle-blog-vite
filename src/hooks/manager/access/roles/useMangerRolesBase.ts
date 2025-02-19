// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { findAllRolesPagination } from "@/api/admin"
// 引入 类型
import type { Pagination, Role } from "@/api/admin/types/findAllRolesPagination"
import { paginationQuery } from "@/api/types/paginationQuery"
export const useMangerRolesBase = (searchKey: Ref<string>) => {
  // 搜索回调
  const handlerSearch = async (key: string) => {
    try {
      const result = await findAllRolesPagination({ name: key })
      // 保存 key
      searchKey.value = key
      tableData.value = result.roles
      pagination.value = result.pagination
      ElMessage.success("搜索成功~")
    } catch (error) {}
  }

  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    await reqAllRoles()
  }

  // 头部 搜索 按钮大小
  const headerBtnsSize = ref<string>()
  // 账号和用户名的 宽度
  const accountsWidth = ref<number>()
  // 右侧 工具栏
  const toolBtnsWidth = ref<number>()
  // 是否是小屏
  const isSmall = ref<boolean>()
  // 处理 窗口变化 的事件
  const handlerResize = () => {
    if (window.innerWidth > 870) {
      // 账号和用户名的 宽度
      accountsWidth.value = 150
      headerBtnsSize.value = "default"
      toolBtnsWidth.value = 290
      isSmall.value = false
      return
    }
    // 账号和用户名的 宽度
    accountsWidth.value = 100
    headerBtnsSize.value = "small"
    toolBtnsWidth.value = 100
    isSmall.value = true
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
      const search = { currentPage, pageSize } as paginationQuery
      // 如果搜索了 则按照搜索的来
      if (searchKey) search.name = searchKey.value
      const result = await findAllRolesPagination(search)
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
    tableData,
    pagination,
    reqAllRoles,
    handlerReset,

    headerBtnsSize,
    accountsWidth,
    toolBtnsWidth,
    isSmall,
  }
}
