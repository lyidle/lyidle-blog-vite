/**
 * Request
 */
export interface AddFilterType {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  createdAt: string
  desc: null | string
  /**
   * 名称
   */
  name: string
  updatedAt: string
  [property: string]: any
}
