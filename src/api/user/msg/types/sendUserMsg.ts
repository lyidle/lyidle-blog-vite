/**
 * Request
 */
export interface SendUserMsg {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  content: string
  createdAt: string
  id: number
  receiverId: number
  senderId: number
  updatedAt: string
  [property: string]: any
}
