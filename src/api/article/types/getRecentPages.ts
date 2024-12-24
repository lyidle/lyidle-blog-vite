/**
 * Request
 */
export interface GetRecentPages {
  data?: Datum[] | null
  message: string
  status: boolean
  [property: string]: any
}

export interface Datum {
  category: string
  createdAt: Date
  id: number
  poster?: null | string
  title: string
  updatedAt: Date
  [property: string]: any
}
