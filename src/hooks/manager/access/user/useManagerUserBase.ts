// 引入api
import { searchUser } from "@/api/user"
// 引入类型
import type { searchData } from "@/api/user/types/searchUserPagination"
import { SearchUserQuery } from "@/api/user/types/searchUserQuery"
import { mitt } from "@/utils/emitter"
export const useManagerUserBase = (searchKey: Ref<string>) => {
  // 表格
  const tableData = ref<searchData["users"]>([])
  // 分页器
  const pagination = ref<searchData["pagination"]>()

  // 搜索回调
  const handlerSearch = async (key: string) => {
    try {
      const result = await searchUser({ nickName: key })
      // 保存 key
      searchKey.value = key
      tableData.value = result?.users || []
      pagination.value = result?.pagination
      ElMessage.success("搜索成功~")
    } catch (error) {}
  }
  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    await reqUsers()
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
      accountsWidth.value = 130
      headerBtnsSize.value = "default"
      toolBtnsWidth.value = 290
      isSmall.value = false
      return
    }
    // 账号和用户名的 宽度
    accountsWidth.value = 70
    headerBtnsSize.value = "small"
    toolBtnsWidth.value = 100
    isSmall.value = true
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
      const search = { currentPage, pageSize } as SearchUserQuery
      // 如果搜索了 则按照搜索的来
      if (searchKey) search.nickName = searchKey.value
      const result = await searchUser(search)
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
    handlerSearch,
    handlerResize,
    userIds,
    handleSelectionChange,
    reqUsers,
    handlerReset,

    headerBtnsSize,
    accountsWidth,
    toolBtnsWidth,
    isSmall,
  }
}
