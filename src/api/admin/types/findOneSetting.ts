/**
 * Request
 */
export interface FindOneSetting {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  content: string[] | { [key: string]: any } | string
  id: number
  name: string
  userId: number
  [property: string]: any
}
