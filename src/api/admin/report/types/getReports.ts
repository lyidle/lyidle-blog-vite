/**
 * Request
 */
export interface GetReports {
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
  articleId?: number | null
  commentId?: number | null
  createdAt?: string
  desc?: string
  filterType: string
  id: number
  isSend: boolean
  msgId?: number | null
  /**
   * "article"|"comment"| "msg"|"user"
   */
  targetType: "article" | "comment" | "msg" | "user"
  targetUserId: number
  updatedAt?: string
  userId: number
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
