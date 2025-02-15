export interface SearchByIdOrAccountOrRoleQuery {
  /**
   * 按照account查詢
   */
  account?: string
  /**
   * 按照id查詢 必须要有一个参数
   */
  id?: number
  /**
   * 按照role查詢
   */
  roles?: string
  [property: string]: any
}
