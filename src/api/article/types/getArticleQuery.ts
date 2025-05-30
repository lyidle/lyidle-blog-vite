export interface GetArticleQuery {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  [property: string]: any
}
