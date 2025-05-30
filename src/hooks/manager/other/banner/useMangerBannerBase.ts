// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { getBannerImgPagination } from "@/api/admin"
// 引入 类型
import type { Pagination } from "@/api/admin/types/findAllRolesPagination"
import type { OrdinarySearchQuery } from "@/api/types/ordinarySearchQuery"
import type { Banner } from "@/api/admin/types/getBannerImgPagination"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"

export const useMangerBannerBase = (searchKey: Ref<string>) => {
  // 当前页
  const currentPage = ref(1)
  // 分页器个数
  const pageSize = ref(10)
  // 搜索回调
  const handlerSearch = async (key: string) => {
    // 设置搜索需要的
    searchKey.value = key
    currentPage.value = 1
    const result = await reqAllBanners()
    if (result) ElMessage.success("搜索成功")
  }

  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    currentPage.value = 1
    const result = await reqAllBanners()
    if (result) ElMessage.success("重置成功")
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

  // 表格的数据
  const tableData = ref<Banner[]>([])
  const pagination = ref<Pagination>()

  // 获取数据
  const reqAllBanners = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const search = {
        currentPage,
        pageSize,
        isBin: true,
        // 不搜索 包含admin 的
        notName: "admin",
      } as OrdinarySearchQuery
      // 如果搜索了 则按照搜索的来
      if (searchKey.value) search.name = searchKey.value
      const result = await getBannerImgPagination(search)
      tableData.value = result.banners
      pagination.value = result.pagination
      return true
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询背景图失败~")
    }
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)
  onMounted(async () => {
    // 得到 数据
    await reqAllBanners()
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
    reqAllBanners,
    handlerReset,
    currentPage,
    pageSize,

    headerBtnsSize,
  }
}
