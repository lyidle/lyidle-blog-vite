/**
 * Request
 */
export interface GetArticle {
  data: Data
  message: string
  status: boolean
  [property: string]: any
}

export interface Data {
  article: Article[]
  pagination: Pagination
  [property: string]: any
}

export interface Article {
  category?: string
  createdAt?: Date
  desc?: string
  id?: number
  poster: null | string
  tags?: string[]
  title?: string
  updatedAt?: Date
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
