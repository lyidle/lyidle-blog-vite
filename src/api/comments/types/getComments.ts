/**
 * Request
 */
export interface GetComments {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  comments: CommentsPaginationItem[]
  pagination: Pagination
  [property: string]: any
}

/**
 * comments pagination item
 */
export interface CommentsPaginationItem {
  articleId: number
  content: string
  createdAt: string
  fromId: number | null
  id: number
  replies: Comments[]
  updatedAt: string
  user: User
  userId: number
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

export interface User {
  account: string
  avatar?: null | string
  id: number
  nickName: string
  userAgent: string
  userProvince: string
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
