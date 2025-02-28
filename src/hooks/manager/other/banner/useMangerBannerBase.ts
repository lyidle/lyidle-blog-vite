// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { getBannerImgPagination } from "@/api/admin"
// 引入 类型
import type { Pagination } from "@/api/admin/types/findAllRolesPagination"
import type { paginationQuery } from "@/api/types/paginationQuery"
import type { Banner } from "@/api/admin/types/getBannerImgPagination"
export const useMangerBannerBase = (searchKey: Ref<string>) => {
  // 当前页
  const currentPage = ref(1)
  // 分页器个数
  const pageSize = ref(10)
  // 搜索回调
  const handlerSearch = async (key: string) => {
    try {
      const result = await getBannerImgPagination({ name: key })
      // 保存 key
      searchKey.value = key
      tableData.value = result.banners
      pagination.value = result.pagination
      currentPage.value = 1
      ElMessage.success("搜索成功~")
    } catch (error) {}
  }

  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    currentPage.value = 1
    await reqAllGroups()
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

  // pagination  的回调
  // 获取权限组
  const reqAllGroups = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const search = { currentPage, pageSize, isBinL: true } as paginationQuery
      // 如果搜索了 则按照搜索的来
      if (searchKey) search.name = searchKey.value
      const result = await getBannerImgPagination(search)
      tableData.value = result.banners
      pagination.value = result.pagination
    } catch (error) {}
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)
  onMounted(async () => {
    // 得到 用户
    await reqAllGroups()
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
    reqAllGroups,
    handlerReset,
    currentPage,
    pageSize,

    headerBtnsSize,
  }
}
