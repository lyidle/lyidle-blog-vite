/**
 * Request
 */
export interface FindOneSetting {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  content: { [key: string]: any } | string
  id: number
  name: string
  [property: string]: any
}
