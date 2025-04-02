/**
 * Request
 */
export interface GetUserLikeDetails {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  likes: Like[]
  pagination: Pagination
  target: Target
  [property: string]: any
}

export interface Like {
  lastLikeAt: string
  likeCount: number
  user: User
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

export interface Target {
  content?: string
  id: number
  name?: string
  title?: string
  link?: string
  type: string
  [property: string]: any
}
