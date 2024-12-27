export interface SearchUserQuery {
  /**
   * 按照account查詢
   */
  account?: string
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
   * 按照role查詢
   */
  role?: string
  [property: string]: any
}
