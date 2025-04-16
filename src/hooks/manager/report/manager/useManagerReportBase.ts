// 引入api
import { getReports } from "@/api/admin/report"
// 引入类型
import type { GetReportQuery } from "@/api/admin/report/types/getReportQuery"
import type { GetReports } from "@/api/admin/report/types/getReports"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
export const useManagerReportBase = () => {
  // 表格
  const tableData = ref<GetReports["data"]["list"]>([])
  // 分页器
  const pagination = ref<GetReports["data"]["pagination"]>()

  // 当前是第几页
  const currentPage = ref(1)
  // 存储每页显示的个数
  const pageSize = ref(10)

  // 头部 搜索 按钮大小
  const headerBtnsSize = ref<string>()
  // 主要的列宽
  const tablePrimaryColumWidth = ref<number>()
  // 右侧 工具栏
  const toolBtnsWidth = ref<number>()
  // 是否是小屏
  const isSmall = ref<boolean>()

  // 处理 窗口变化 的事件
  const handlerResize = () => {
    if (window.innerWidth > 870) {
      // 主要的列宽
      tablePrimaryColumWidth.value = 130
      headerBtnsSize.value = "default"
      toolBtnsWidth.value = 290
      isSmall.value = false
      return
    }
    // 主要的列宽
    tablePrimaryColumWidth.value = 70
    headerBtnsSize.value = "small"
    toolBtnsWidth.value = 100
    isSmall.value = true
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)

  // 选中的id
  const reportsId = ref<number[]>([])
  // 处理 多选框 变化问题
  const handleSelectionChange = (user: GetReports["data"]["list"]) => {
    // 得到 选择的的id
    reportsId.value = user.map((item) => item.id)
  }

  // 多选框
  const types = ref("user")
  const typeOptions = [
    { value: "user", label: "用户" },
    { value: "article", label: "文章" },
    { value: "comment", label: "评论" },
    { value: "msg", label: "消息" },
  ] as const

  // 获取数据
  const reqReports = async (currentPage: number = 1, pageSize: number = 10) => {
    try {
      const search = {
        currentPage,
        pageSize,
        type: types.value,
        isSend: false,
      } as GetReportQuery

      const result = await getReports(search)
      tableData.value = result?.list || []
      pagination.value = result?.pagination
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询举报信息失败~")
    }
  }

  onMounted(async () => {
    // 得到 数据
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
    toolBtnsWidth,
    isSmall,

    // 多选框
    types,
    typeOptions,
  }
}
