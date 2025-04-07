/**
 * Request
 */
export interface GetUserAt {
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
  comment: Comment
  createdAt: string
  id: number
  link: string
  mentionedBy: MentionedBy
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

export interface MentionedBy {
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
