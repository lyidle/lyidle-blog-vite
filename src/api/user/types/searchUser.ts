/**
 * Request
 */
export interface SearchUser {
  code: number
  data?: Datum[] | DataObject
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  account: string
  avatar: null | string
  createdAt: string
  email: string
  id: number
  isBin: number
  nickName: string
  roles: string[]
  signer: null | string
  updatedAt: string
  [property: string]: any
}

export interface DataObject {
  msg?: Msg
  [property: string]: any
}

export interface Msg {
  account?: string
  email?: string
  id?: number
  nickName?: string
  roles?: string
  [property: string]: any
}
