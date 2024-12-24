/**
 * Request
 */
export interface Login {
  data: Data
  message: string
  status: boolean
  [property: string]: any
}

export interface Data {
  token: string
  [property: string]: any
}
