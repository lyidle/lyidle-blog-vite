/**
 * Request
 */
export interface GetUserInfo {
  data?: Data
  message: string
  status: boolean
  [property: string]: any
}

export interface Data {
  account: string
  avater: null | string
  createdAt: string
  email: string
  id: number
  nickName: string
  role: string[]
  signer: null | string
  token: string
  updatedAt: string
  userInfo: UserInfo
  [property: string]: any
}

export interface UserInfo {
  categories: string
  id: number
  pages: number
  tags: string[]
  totalWords: number
  [property: string]: any
}
