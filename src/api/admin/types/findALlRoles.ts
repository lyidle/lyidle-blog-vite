/**
 * Request
 */
export interface FindAllRoles {
  code: number
  data: Datum[]
  message: string
  [property: string]: any
}

export interface Datum {
  createdAt: string
  desc: null
  id: number
  isBin: null
  name: string
  updatedAt: string
  [property: string]: any
}
