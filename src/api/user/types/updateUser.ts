/**
 * Request
 */
export interface UpdateUser {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  token: string
  // isUser 是 管理面板的
  isUser?: boolean
  [property: string]: any
}
