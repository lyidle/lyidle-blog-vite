/**
 * Request
 */
export interface GetFollowUser {
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
  total?: number
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
