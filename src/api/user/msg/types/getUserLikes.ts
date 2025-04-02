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
  items: Item[]
  pagination: Pagination
  [property: string]: any
}

export interface Item {
  articleId?: number
  commentId?: number
  content?: string
  lastLikeAt: string
  likeCount: number
  link?: string
  name?: string
  recentLikers: RecentLiker[]
  settingId?: number
  title?: string
  type: string
  updatedAt: string
  [property: string]: any
}

export interface RecentLiker {
  account: string
  avatar: null | string
  id: number
  nickName: string
  [property: string]: any
}

export interface Pagination {
  articleCount?: number
  commentCount?: number
  currentPage: number
  pageSize: number
  settingCount?: number
  total?: number
  [property: string]: any
}
