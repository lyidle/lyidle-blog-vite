/**
 * Request
 */
export interface FindByAccount {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  pagination: Pagination
  users: User[]
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}

export interface User {
  account: string
  avatar: null | string
  createdAt: string
  email: string
  id: number
  isBin: null | string
  nickName: string
  signer: null | string
  updatedAt: string
  userAgent: null | string
  userProvince: null | string
  [property: string]: any
}
