// 引入api
import { getFilterWordGroups } from "@/api/admin/filter/group/types"
// 引入类型
import type { GetReportQuery } from "@/api/admin/report/types/getReportQuery"
import type { GetFilterWordGroups } from "@/api/admin/filter/group/types/getFilterWordGroups"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
export const useFilterGroupsBase = () => {
  // 表格
  const tableData = ref<GetFilterWordGroups["data"]["list"]>([])
  // 分页器
  const pagination = ref<GetFilterWordGroups["data"]["pagination"]>()

  // 当前是第几页
  const currentPage = ref(1)
  // 存储每页显示的个数
  const pageSize = ref(10)

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

  // 选中的 userId
  const reportsId = ref<number[]>([])
  // 处理 多选框 变化问题
  const handleSelectionChange = (user: GetFilterWordGroups["data"]["list"]) => {
    // 得到 选择的user的id
    reportsId.value = user.map((item) => item.id)
  }

  // 获取用户
  const reqReports = async (currentPage: number = 1, pageSize: number = 10) => {
    try {
      const search = {
        currentPage,
        pageSize,
      } as GetReportQuery

      const result = await getFilterWordGroups(search)
      tableData.value = result?.list || []
      pagination.value = result?.pagination
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询用户失败~")
    }
  }

  onMounted(async () => {
    // 得到 用户
    await reqReports()
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
    handlerResize,
    reportsId,
    handleSelectionChange,
    reqReports,
    currentPage,
    pageSize,

    headerBtnsSize,
    tablePrimaryColumWidth,
  }
}
