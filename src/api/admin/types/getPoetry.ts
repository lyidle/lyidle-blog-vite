/**
 * Request
 */
export interface GetPoetry {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  author: string
  content: string
  [property: string]: any
}
