/**
 * Request
 */
export interface SearchUser {
  code: number
  data?: Datum[] | DataObject
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
  createdAt: string
  id: number
  length: number
  poster: null | string
  tags: string[]
  title: string
  updatedAt: string
  userId: number
  [property: string]: any
}

export interface DataObject {
  msg?: Msg
  [property: string]: any
}

export interface Msg {
  account?: string
  email?: string
  id?: number
  nickName?: string
  role?: string
  [property: string]: any
}
