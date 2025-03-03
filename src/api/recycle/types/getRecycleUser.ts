/**
 * Request
 */
export interface GetRecycleUser {
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
  isBin: Date | null
  nickName: string
  signer: null | string
  updatedAt: string
  [property: string]: any
}
