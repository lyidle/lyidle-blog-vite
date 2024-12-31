/**
 * Request
 */
export interface GetCarousel {
  code: number
  data?: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  category: string
  desc: string
  id: number
  poster: null
  title: string
  updatedAt: string
  [property: string]: any
}
