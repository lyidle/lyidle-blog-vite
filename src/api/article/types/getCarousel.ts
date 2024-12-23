/**
 * Request
 */
export interface GetCarousel {
  data: Datum[]
  message: string
  status: boolean
  [property: string]: any
}

export interface Datum {
  category: string
  desc: string
  id: number
  poster: null | string
  title: string
  updatedAt: Date
  [property: string]: any
}
