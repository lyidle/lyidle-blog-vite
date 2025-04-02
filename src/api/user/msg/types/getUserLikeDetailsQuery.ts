export interface GetUserLikeDetailsQuery {
  /**
   * 只能指定一种ID类型进行查询
   */
  articleId?: number
  /**
   * 只能指定一种ID类型进行查询
   */
  commentId?: number
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  /**
   * 只能指定一种ID类型进行查询
   */
  settingId?: number
  [property: string]: any
}
