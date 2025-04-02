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
  createdAt: string
  id: number
  updatedAt: string
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
  type: "article" | "comment" | "setting"
  [property: string]: any
}
