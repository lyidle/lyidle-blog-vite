/**
 * Request
 */
export interface GetCommentsReplies {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  pagination: Pagination
  replies: Comments[]
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total?: number
  [property: string]: any
}

/**
 * comments
 */
export interface Comments {
  articleId: number
  content: string
  createdAt: string
  fromId: number | null
  id: number
  updatedAt: string
  userId: number
  [property: string]: any
}
