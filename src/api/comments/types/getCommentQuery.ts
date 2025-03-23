export interface GetCommentQuery {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * "new" | "late" | "like"
   */
  key?: "new" | "late" | "like"
  /**
   * "desc" | "asc"
   */
  order?: "desc" | "asc"
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  [property: string]: any
}
