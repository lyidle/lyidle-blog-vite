/**
 * Request
 */
export interface GetUserInfo {
  code: number
  data?: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  account: string
  avatar: null | string
  counts: Counts
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

export interface Counts {
  categories: number
  pages: number
  tags: number
  [property: string]: any
}
