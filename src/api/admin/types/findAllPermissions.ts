/**
 * Request
 */
export interface FindAllPermissions {
  code: number
  data: Datum[]
  message: string
  [property: string]: any
}

export interface Datum {
  createdAt: string
  desc: null | string
  id: number
  isBin: null | string
  name: string
  updatedAt: string
  [property: string]: any
}
