/**
 * Request
 */
export interface GetFilterWordGroups {
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
  createdAt: string
  desc: null | string
  id: number
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
