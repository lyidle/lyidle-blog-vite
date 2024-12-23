/**
 * Request
 */
export interface GetPoetry {
  data: Data
  message: string
  status: boolean
  [property: string]: any
}

export interface Data {
  author: string
  content: string
  [property: string]: any
}
