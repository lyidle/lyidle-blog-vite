/**
 * Request
 */
export interface GetUserLikes {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  likes: Like[]
  pagination: Pagination
  [property: string]: any
}

export interface Like {
  article?: null | Article
  comment: null | Comment
  id?: number
  setting?: null | Setting
  user?: null | User
  [property: string]: any
}

export interface Article {
  id: number
  title: string
  updatedAt: string
  [property: string]: any
}

export interface Comment {
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
  userId: number
  [property: string]: any
}

export interface Setting {
  id: number
  /**
   * 名称
   */
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

export interface Pagination {
  currentPage: number
  pageSize: number
  total?: number
  [property: string]: any
}
