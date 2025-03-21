/**
 * Request
 */
export interface UserFindByPk {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  account: string
  avatar: null | string
  createdAt: string
  email: string
  id: number
  isBin: null | string
  nickName: string
  signer: null | string
  updatedAt: string
  [property: string]: any
}
