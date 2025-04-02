/**
 * Request
 */
export interface GetUserReply {
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
  article: null | Article
  articleId: number | null
  content: string
  createdAt: string
  fromComment: null | FromComment
  fromId: number | null
  fromUserId: number | null
  id: number
  link: string
  parentComment: null | ParentComment
  parentId: number | null
  setting: null | Setting
  settingId: number | null
  targetUserId: number
  updatedAt: string
  user: User
  userId: number
  [property: string]: any
}

export interface Article {
  id: number
  title: string
  updatedAt: string
  [property: string]: any
}

export interface FromComment {
  content: string
  id: number
  link: string
  [property: string]: any
}

export interface ParentComment {
  content: string
  id: number
  link: string
  [property: string]: any
}

export interface Setting {
  id: number
  link: string
  name: string
  updatedAt: string
  [property: string]: any
}

export interface User {
  account: string
  avatar: null | string
  id: number
  nickName: string
  [property: string]: any
}
