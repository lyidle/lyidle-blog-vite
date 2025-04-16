/**
 * Request
 */
export interface GetFilterWords {
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
  id: number
  type: string
  updatedAt: string
  word: string
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
