/**
 * Request
 */
export interface FindAllRolesPagination {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  pagination: Pagination
  roles: Role[]
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}

export interface Role {
  createdAt: string
  desc: null
  id: number
  isBin: null
  name: string
  updatedAt: string
  [property: string]: any
}
