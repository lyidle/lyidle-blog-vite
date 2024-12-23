/**
 * Request
 */
export interface GetRecentPages {
  data: Datum[]
  message: string
  status: boolean
  [property: string]: any
}

export interface Datum {
  createdAt: Date
  poster: null
  title: string
  [property: string]: any
}
