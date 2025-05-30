// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 api
import { searchArticleMerge } from "@/api/article"
// 引入 类型
import type { Pagination } from "@/api/admin/types/findAllRolesPagination"
import type { Article } from "@/utils/doc/orderArticle"
import type { paginationQuery } from "@/api/types/paginationQuery"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
export const useArticleManager = (searchKey: Ref<string>) => {
  // 当前页
  const currentPage = ref(1)
  // 分页器个数
  const pageSize = ref(10)
  // 搜索回调
  const handlerSearch = async (key: string) => {
    try {
      const result = await searchArticleMerge({ author: key })
      // 保存 key
      searchKey.value = key
      tableData.value = result.article
      pagination.value = result.pagination
      currentPage.value = 1
      ElMessage.success("搜索文章成功~")
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("搜索文章失败~")
    }
  }

  const handlerReset = async () => {
    // 重置 key
    searchKey.value = ""
    currentPage.value = 1
    const result = await reqAllArticles()
    if (result) ElMessage.success("重置成功")
  }

  // 头部 搜索 按钮大小
  const headerBtnsSize = ref<string>()
  // 主要的列宽
  const tablePrimaryColumWidth = ref<number>()
  // 是否是小屏
  const isSmall = ref<boolean>()
  // 处理 窗口变化 的事件
  const handlerResize = () => {
    if (window.innerWidth > 870) {
      // 主要的列宽
      tablePrimaryColumWidth.value = 150
      headerBtnsSize.value = "default"
      isSmall.value = false
      return
    }
    // 主要的列宽
    tablePrimaryColumWidth.value = 100
    headerBtnsSize.value = "small"
    isSmall.value = true
  }

  // 表格的数据
  const tableData = ref<Article[]>([])
  const pagination = ref<Pagination>()

  let isInit = false
  // 获取数据
  const reqAllArticles = async (
    currentPage: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const search = { currentPage, pageSize } as paginationQuery
      // 如果搜索了 则按照搜索的来
      if (searchKey.value) search.author = searchKey.value
      const result = await searchArticleMerge(search)
      tableData.value = result.article
      pagination.value = result.pagination
      if (isInit)
        // 重新加载路由
        mitt.emit("route:reload")
      isInit = true
      return true
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage.error("查询文章失败~")
    }
  }

  // 监听窗口变化
  mitt.on("window:resize", handlerResize)
  onMounted(async () => {
    // 得到 数据
    await reqAllArticles()
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
    reqAllArticles,
    handlerReset,
    currentPage,
    pageSize,

    headerBtnsSize,
    tablePrimaryColumWidth,
    isSmall,
  }
}
