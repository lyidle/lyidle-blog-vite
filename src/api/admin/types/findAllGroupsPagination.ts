/**
 * Request
 */
export interface FindAllGroupsPagination {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  groups: Group[]
  pagination: Pagination
  [property: string]: any
}

export interface Group {
  children: Child[]
  createdAt: string
  desc: null | string
  id: number
  isBin: null | string
  name: string
  updatedAt: string
  [property: string]: any
}

export interface Child {
  createdAt: string
  desc: null | string
  id: number
  isBin: null | string
  name: string
  updatedAt: string
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
