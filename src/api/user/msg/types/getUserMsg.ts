/**
 * Request
 */
export interface GetUserMsg {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  list: List[]
  pagination: Pagination
  [property: string]: any
}

export interface List {
  message?: MessageObject
  user: User
  [property: string]: any
}

export interface MessageObject {
  content: string
  createdAt: string
  id: number
  receiverId: number
  senderId: number
  updatedAt: string
  [property: string]: any
}

export interface User {
  account: string
  avatar: null | string
  id: number
  nickName: string
  signer: null | string
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total?: number
  [property: string]: any
}
