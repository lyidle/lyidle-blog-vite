/**
 * Request
 */
export interface FindALlRoles {
  code: number
  data: Datum[]
  message: string
  [property: string]: any
}

export interface Datum {
  createdAt: string
  desc: null | string
  id: number
  isBin: Date | null
  name: string
  updatedAt: string
  [property: string]: any
}
