/**
 * Request
 */
export interface AddCommentBody {
  articleId: number
  content: string
  fromId?: number | null
  parentId?: number | null
  userProvince?: string | null
  userAgent?: string | null
  [property: string]: any
}
