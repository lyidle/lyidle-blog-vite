/**
 * Request
 */
export interface GetArticle {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  article: Article[]
  pagination: Pagination
  [property: string]: any
}

export interface Article {
  author: string
  category: string
  createdAt: string
  desc: string
  id: number
  poster: null | string
  tags: string[]
  title: string
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
