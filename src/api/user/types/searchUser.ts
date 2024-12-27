/**
 * Request
 */
export interface SearchUser {
  data?: Datum[]
  message: string
  status: boolean
  [property: string]: any
}

export interface Datum {
  account: string
  articles: Article[]
  avater: null | string
  createdAt: string
  email: string
  id: number
  nickName: string
  role: string[]
  signer: null | string
  status: number
  token: null | string
  updatedAt: string
  userInfo: null | UserInfo
  [property: string]: any
}

export interface Article {
  category: string
  tags: string[]
  title: string
  userId: number
  [property: string]: any
}

export interface UserInfo {
  categories: string
  id: number
  pages: number
  tags: string[]
  totalWords: number
  userId: number
  [property: string]: any
}
