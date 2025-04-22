// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { getSiteTimes } from "@/api/webInfo"
// 引入 类型
import type { GetSiteTimes } from "@/api/webInfo/types/getSiteTimes"
import type { OrdinarySearchQuery } from "@/api/types/ordinarySearchQuery"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

export const useMangerSiteTimeBase = () => {
  // 当前页
  const currentPage = ref(1)
  // 分页器个数
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
      tablePrimaryColumWidth.value = 150
      headerBtnsSize.value = "default"
      toolBtnsWidth.value = 290
      isSmall.value = false
      return
    }
    // 主要的列宽
    tablePrimaryColumWidth.value = 100
    headerBtnsSize.value = "small"
    toolBtnsWidth.value = 100
    isSmall.value = true
  }
  // 表格的数据
  const tableData = ref<GetSiteTimes["data"]["list"]>([])
  const pagination = ref<GetSiteTimes["data"]["pagination"]>()

  // 获取数据
  const reqSiteTimes = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const search = { currentPage, pageSize } as OrdinarySearchQuery
      // 如果搜索了 则按照搜索的来
      const result = await getSiteTimes(search)
      tableData.value = result.list
      pagination.value = result.pagination
      return true
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询设置信息失败~")
    }
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)
  onMounted(async () => {
    // 得到 设置信息
    await reqSiteTimes()
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
    reqSiteTimes,
    currentPage,
    pageSize,

    headerBtnsSize,
    tablePrimaryColumWidth,
    toolBtnsWidth,
    isSmall,
  }
}
