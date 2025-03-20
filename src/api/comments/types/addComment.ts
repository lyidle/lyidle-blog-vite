/**
 * Request
 */
export interface AddComment {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  articleId: number
  content: string
  createdAt: string
  fromId: number | null
  id: number
  updatedAt: string
  userId: number
  [property: string]: any
}
