/**
 * Request
 */
export interface AddArticle {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  id: number
  [property: string]: any
}
