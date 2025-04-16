// 引入api
import { getAllFilterTypes, getFilterWords } from "@/api/admin/filter"
// 引入类型
import type { GetReportQuery } from "@/api/admin/report/types/getReportQuery"
import type { GetFilterWords } from "@/api/admin/filter/types/getFilterWords"

// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
export const useFilterWordsBase = () => {
  // 表格
  const tableData = ref<GetFilterWords["data"]["list"]>([])
  // 分页器
  const pagination = ref<GetFilterWords["data"]["pagination"]>()

  // 当前是第几页
  const currentPage = ref(1)
  // 存储每页显示的个数
  const pageSize = ref(10)

  // 头部 搜索 按钮大小
  const headerBtnsSize = ref<string>()

  // 处理 窗口变化 的事件
  const handlerResize = () => {
    if (window.innerWidth > 870) {
      headerBtnsSize.value = "default"
      return
    }
    headerBtnsSize.value = "small"
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)

  // 选中的id
  const reportsId = ref<number[]>([])
  // 处理 多选框 变化问题
  const handleSelectionChange = (user: GetFilterWords["data"]["list"]) => {
    // 得到 选择的的id
    reportsId.value = user.map((item) => item.id)
  }

  // 多选框
  const types = ref("色情")
  const typeOptions = ref([{ value: "色情", label: "色情" }])

  // 得到 分类信息
  onMounted(async () => {
    try {
      const result = await getAllFilterTypes()
      // 处理分类信息
      typeOptions.value = result?.map((item) => ({
        value: item.name,
        label: item.name,
      }))
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("获取敏感词分类失败")
    }
  })

  // 获取数据
  const reqFilterWOrds = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const search = {
        currentPage,
        pageSize,
        type: types.value,
        isSend: false,
      } as GetReportQuery

      const result = await getFilterWords(search)
      tableData.value = result?.list || []
      pagination.value = result?.pagination
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询敏感词失败~")
    }
  }

  onMounted(async () => {
    // 得到 数据
    await reqFilterWOrds()
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
    reqFilterWOrds,
    currentPage,
    pageSize,

    headerBtnsSize,

    // 多选框
    types,
    typeOptions,
  }
}
