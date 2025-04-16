// 引入api
import { getSystemMsg } from "@/api/admin/sysMsg"
// 引入类型
import type { GetMsg } from "@/api/admin/sysMsg/types/getMsg"
import type { GetMsgQuery } from "@/api/admin/sysMsg/types/getMsgQuery"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
export const useManagerSystemMessage = () => {
  // 表格
  const tableData = ref<GetMsg["data"]["list"]>([])
  // 分页器
  const pagination = ref<GetMsg["data"]["pagination"]>()

  // 当前是第几页
  const currentPage = ref(1)
  // 存储每页显示的个数
  const pageSize = ref(10)

  // 搜索的key
  const searchKey = ref<string | null>()

  // 搜索回调
  const handlerSearch = async (key: string) => {
    if (!Number.isInteger(+key)) {
      ElMessage.warning("搜索的userId需要是一个整数")
      return
    }
    // 设置搜索需要的
    searchKey.value = key
    currentPage.value = 1
    await reqSysMsgs()
    ElMessage.success("搜索成功")
  }
  // 重置 搜索
  const handlerReset = async () => {
    // 重置 key
    searchKey.value = null
    currentPage.value = 1
    await reqSysMsgs()
    ElMessage.success("重置搜索成功")
  }

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
  const handleSelectionChange = (user: GetMsg["data"]["list"]) => {
    // 得到 选择的的id
    reportsId.value = user.map((item) => item.id)
  }

  // 获取数据
  const reqSysMsgs = async (currentPage: number = 1, pageSize: number = 10) => {
    try {
      const search = {
        currentPage,
        pageSize,
      } as GetMsgQuery

      if (searchKey.value && Number.isInteger(+searchKey.value))
        search.userId = +searchKey.value

      const result = await getSystemMsg(search)
      tableData.value = result?.list || []
      pagination.value = result?.pagination
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询系统消息失败~")
    }
  }

  onMounted(async () => {
    // 得到 数据
    await reqSysMsgs()
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
    reqSysMsgs,
    currentPage,
    pageSize,

    headerBtnsSize,

    // 搜索
    handlerSearch,
    handlerReset,
    searchKey,
  }
}
