export interface GetBannerImgPaginationQuery {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  isBin?: string
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  [property: string]: any
}
