// 引入api
import { searchExactUser, searchUser } from "@/api/user"
// 引入类型
import type { searchData } from "@/api/user/types/searchUserPagination"
import { mitt } from "@/utils/emitter"
export const useManagerUserBase = () => {
  // 表格
  const tableData = ref<searchData["users"]>([])
  // 分页器
  const pagination = ref<searchData["pagination"]>()

  // 头部 搜索 按钮大小
  const headerBtnsSize = ref("default")
  // 账号和用户名的 宽度
  const accountsWidth = ref(130)

  // 搜索回调
  const handlerSearch = async (key: string) => {
    try {
      const result = await searchUser({ nickName: key })
      tableData.value = result?.users || []
      pagination.value = result?.pagination
      ElMessage.success("搜索成功~")
    } catch (error) {}
  }
  const handlerReset = async () => {
    await reqUsers()
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

  // 选中的 userId
  const userIds = ref<number[]>([])
  // 处理 多选框 变化问题
  const handleSelectionChange = (user: searchData["users"]) => {
    // 得到 选择的user的id
    userIds.value = user.map((item) => item.id)
  }

  // 获取用户
  const reqUsers = async (currentPage: number = 1, pageSize: number = 10) => {
    try {
      const result = await searchExactUser({ currentPage, pageSize })
      tableData.value = result?.users || []
      pagination.value = result?.pagination
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

  return {
    tableData,
    pagination,
    headerBtnsSize,
    accountsWidth,
    handlerSearch,
    handlerResize,
    userIds,
    handleSelectionChange,
    reqUsers,
    handlerReset,
  }
}
