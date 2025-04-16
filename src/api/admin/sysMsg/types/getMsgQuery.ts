export interface GetMsgQuery {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  /**
   * 查询的userId
   */
  userId?: number
  [property: string]: any
}
