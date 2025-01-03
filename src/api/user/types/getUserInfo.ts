/**
 * Request
 */
export interface GetUserInfo {
  code: number
  data?: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  account: string
  Articles: Article[]
  avatar: null | string
  createdAt: string
  email: string
  id: number
  isBin: number
  nickName: string
  role: string[]
  signer: null | string
  updatedAt: string
  [property: string]: any
}

export interface Article {
  category: string
  id: number
  length: number
  tags: string[]
  title: string
  userId: number
  [property: string]: any
}
