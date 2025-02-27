/**
 * Request
 */
export interface GetBannerImg {
  code: number
  data: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  createdAt?: string
  dark?: null | string
  height?: null | string
  id: number
  light?: null | string
  name: string
  updatedAt?: string
  [property: string]: any
}
