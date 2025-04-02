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
  replies: Reply[]
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total?: number
  [property: string]: any
}

export interface Reply {
  articleId: number
  content: string
  createdAt: string
  fromComment: FromComment
  fromId: number | null
  id: number
  updatedAt: string
  user: CommentUser
  userId: number
  [property: string]: any
}

export interface FromComment {
  articleId: number
  content: string
  createdAt: string
  fromId: number | null
  id: number
  updatedAt: string
  user: CommentUser
  userId: number
  [property: string]: any
}

/**
 * comment user
 */
export interface CommentUser {
  account: string
  avatar?: null | string
  id: number
  nickName: string
  userAgent: string
  userProvince: string
  [property: string]: any
}
