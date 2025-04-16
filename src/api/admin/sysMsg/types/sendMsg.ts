/**
 * Request
 */
export interface SendMsg {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  content: string
  createdAt: string
  id: number
  title: string
  updatedAt: string
  userId: null
  [property: string]: any
}
