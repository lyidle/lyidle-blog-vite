export interface SearchByIdOrAccountOrRoleQuery {
  /**
   * 按照account查询
   */
  account?: string
  /**
   * 按照id查詢 必须要有一个参数
   */
  id?: number
  /**
   * 是否查询用户是查询回收站的，只控制user
   */
  isBin?: string
  /**
   * 按照owner查詢
   */
  roles?: string
  [property: string]: any
}
