/**
 * Request
 */
export interface GetUserSystemMsg {
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
  content: string
  createdAt: string
  id: number
  title: string
  updatedAt: string
  userId: number
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total?: number
  [property: string]: any
}
