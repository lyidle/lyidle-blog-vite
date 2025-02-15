/**
 * Request
 */
export interface SearchUserPagination {
  code: number
  data?: searchData
  message: string[] | string
  [property: string]: any
}

/**
 * 搜索用户data
 */
export interface searchData {
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

/**
 * 搜索用户dataItem
 */
export interface User {
  account: string
  avatar: null
  createdAt: string
  email: string
  id: number
  isBin: null
  nickName: string
  roles: string[]
  signer: null
  updatedAt: string
  [property: string]: any
}
