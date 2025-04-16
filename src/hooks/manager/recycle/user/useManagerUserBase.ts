// 引入api
import { recycleAllUsers } from "@/api/recycle"
// 引入类型
import type { searchData } from "@/api/user/types/searchUserPagination"
import type { SearchUserQuery } from "@/api/recycle/types/searchUserQuery"
import type { GetRecycleUser } from "@/api/recycle/types/getRecycleUser"

import { mitt } from "@/utils/emitter"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

export const useManagerUserBase = (searchKey: Ref<string>) => {
  // 表格
  const tableData = ref<GetRecycleUser["data"]["users"]>([])
  // 分页器
  const pagination = ref<searchData["pagination"]>()

  // 当前是第几页
  const currentPage = ref(1)
  // 存储每页显示的个数
  const pageSize = ref(10)
  // 搜索回调
  const handlerSearch = async (key: string) => {
    // 设置搜索需要的
    searchKey.value = key
    currentPage.value = 1
    await reqUsers()
  }
  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    currentPage.value = 1
    await reqUsers()
  }

  // 头部 搜索 按钮大小
  const headerBtnsSize = ref<string>()
  // 主要的列宽
  const tablePrimaryColumWidth = ref<number>()

  // 处理 窗口变化 的事件
  const handlerResize = () => {
    if (window.innerWidth > 870) {
      // 主要的列宽
      tablePrimaryColumWidth.value = 130
      headerBtnsSize.value = "default"
      return
    }
    // 主要的列宽
    tablePrimaryColumWidth.value = 70
    headerBtnsSize.value = "small"
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)

  // 选中的id
  const userIds = ref<number[]>([])
  // 处理 多选框 变化问题
  const handleSelectionChange = (user: searchData["users"]) => {
    // 得到 选择的的id
    userIds.value = user.map((item) => item.id)
  }

  // 获取数据
  const reqUsers = async (currentPage: number = 1, pageSize: number = 10) => {
    try {
      const search = { currentPage, pageSize } as SearchUserQuery
      // 如果搜索了 则按照搜索的来
      if (searchKey.value) search.account = searchKey.value
      const result = await recycleAllUsers(search)
      tableData.value = result?.users || []
      pagination.value = result?.pagination
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询用户失败~")
    }
  }

  onMounted(async () => {
    // 得到 数据
    await reqUsers()
    // 处理 窗口变化 的事件
    handlerResize()
  })

  onBeforeUnmount(() => {
    // 卸载监听窗口变化
    mitt.off("window:resize", handlerResize)
  })

  return {
    tableData,
    pagination,
    handlerSearch,
    handlerResize,
    userIds,
    handleSelectionChange,
    reqUsers,
    handlerReset,
    currentPage,
    pageSize,

    headerBtnsSize,
    tablePrimaryColumWidth,
  }
}
