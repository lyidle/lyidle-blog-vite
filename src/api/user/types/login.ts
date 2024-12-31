/**
 * Request
 */
export interface Login {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  token: string
  [property: string]: any
}
