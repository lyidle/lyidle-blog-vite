/**
 * Request
 */
export interface GetUserMsgDetails {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  list: List[]
  pagination: Pagination
  receiver: Receiver
  sender: Sender
  [property: string]: any
}

export interface List {
  content: string
  createdAt: string
  id: number
  receiverId: number
  senderId: number
  updatedAt: string
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total?: number
  [property: string]: any
}

export interface Receiver {
  account: string
  avatar: null | string
  id: number
  nickName: string
  [property: string]: any
}

export interface Sender {
  account: string
  avatar: null | string
  id: number
  nickName: string
  [property: string]: any
}
