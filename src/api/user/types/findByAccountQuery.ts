export interface FindByAccountQuery {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  keyword?: string
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  [property: string]: any
}
