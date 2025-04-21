/**
 * Request
 */
export interface GetCollects {
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
  articleId: number
  createdAt: string
  id: number
  isBookmarked: boolean
  updatedAt: string
  userId: number
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
