export interface SearchUserQuery {
  /**
   * 按照account查詢
   */
  account?: string
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * 按照email查詢
   */
  email?: string
  /**
   * 按照id查詢 必须要有一个参数
   */
  id?: number
  /**
   * 按照nickNam查詢
   */
  nickName?: string
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  /**
   * 按照role查詢
   */
  role?: string
  [property: string]: any
}
