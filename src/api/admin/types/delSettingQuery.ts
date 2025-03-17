export interface DelSettingQuery {
  /**
   * ID 编号（必传）
   */
  id?: number
  /**
   * 内容（必传）
   */
  name?: string
  [property: string]: any
}
