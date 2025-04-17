/**
 * Request
 */
export interface GetMsgByPk {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  content: string
  createdAt: string
  id: number
  isRead: boolean
  msgId: string
  receiverId: number
  senderId: number
  updatedAt: string
  [property: string]: any
}
