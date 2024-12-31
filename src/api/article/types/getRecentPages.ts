/**
 * Request
 */
export interface GetRecentPages {
  code: number
  data?: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  category?: string
  createdAt?: string
  id?: number
  poster?: null
  title?: string
  updatedAt?: string
  [property: string]: any
}
