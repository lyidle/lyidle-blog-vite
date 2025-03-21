/**
 * Request
 */
export interface GetComments {
  code: number
  data: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  articleId: number
  content: string
  createdAt: string
  fromId: null
  id: number
  replies: The154549791[]
  updatedAt: string
  user: User
  userId: number
  [property: string]: any
}

/**
 * comments
 */
export interface The154549791 {
  articleId: number
  content: string
  createdAt: string
  fromId: null
  id: number
  updatedAt: string
  user: User
  userId: number
  [property: string]: any
}

export interface User {
  id: number
  nickName: string
  avatar: string | null
  account: string
  userProvince: string | null
  userAgent: string | null
  [property: string]: any
}
