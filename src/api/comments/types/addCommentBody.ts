/**
 * Request
 */
export interface AddCommentBody {
  commentId: string
  articleId?: number
  settingId?: number
  content: string
  fromId?: number | null
  fromUserId?: number | null
  parentId?: number | null
  userProvince?: string | null
  userAgent?: string | null
  link?: string | null
  mentionsUserIds?: number[]
  [property: string]: any
}
