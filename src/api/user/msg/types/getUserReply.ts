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
  articleId: number | null
  content: string
  createdAt: string
  fromId: number | null
  fromUserId: number | null
  replies: null | ParentComment
  id: number
  link: string
  parentComment: null | ParentComment
  parentId: number | null
  settingId: number | null
  targetUserId: number
  updatedAt: string
  user: ReplyUser
  userId: number
  [property: string]: any
}

export interface ParentComment {
  articleId: number | null
  content: string
  createdAt: string
  fromId: number | null
  fromUserId: number | null
  id: number
  link: string
  parentId: number | null
  settingId: number | null
  targetUserId: number
  updatedAt: string
  user: ParentCommentUser
  userId: number
  [property: string]: any
}

export interface ParentCommentUser {
  account: string
  avatar: null | string
  id: number
  nickName: string
  [property: string]: any
}

export interface ReplyUser {
  account: string
  avatar: null | string
  id: number
  nickName: string
  [property: string]: any
}
