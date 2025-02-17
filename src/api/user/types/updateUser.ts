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
  isUser: boolean
  isOwner: boolean
  [property: string]: any
}
