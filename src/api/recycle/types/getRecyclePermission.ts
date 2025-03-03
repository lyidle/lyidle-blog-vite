/**
 * Request
 */
export interface GetRecyclePermission {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  pagination: Pagination
  permissions: Permission[]
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}

export interface Permission {
  createdAt: string
  desc: null | string
  id: number
  isBin: null | string
  name: string
  updatedAt: string
  [property: string]: any
}
