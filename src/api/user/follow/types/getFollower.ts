export interface GetFollower {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  /**
   * 可以先查询出total，不传递的话会再次查询
   */
  total?: number
  userId: number
  [property: string]: any
}
