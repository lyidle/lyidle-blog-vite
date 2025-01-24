/**
 * Request
 */
export interface PostTempImg {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  origin: string
  url: string
  [property: string]: any
}
