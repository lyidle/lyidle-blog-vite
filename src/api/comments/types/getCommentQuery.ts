export interface GetCommentQuery {
  /**
   * 按照文章的查询
   */
  articleId?: string
  /**
   * 按照设置的查询
   */
  settingId?: string
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
