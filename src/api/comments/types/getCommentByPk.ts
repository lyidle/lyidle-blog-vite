/**
 * Request
 */
export interface GetCommentByPk {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  content: string
  createdAt: string
  id: number
  link: string
  isRead: boolean
  msgId: string
  receiverId: number
  senderId: number
  updatedAt: string
  [property: string]: any
}
