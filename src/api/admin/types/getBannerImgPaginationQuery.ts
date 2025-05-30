export interface GetBannerImgPaginationQuery {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * 是否搜索垃圾桶的
   */
  isBin?: string
  /**
   * 名称
   */
  name?: string
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  [property: string]: any
}
