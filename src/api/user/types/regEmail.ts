/**
 * Request
 */
export interface RegEmail {
  data: Data
  message: string
  status: boolean
  [property: string]: any
}

export interface Data {
  email: string
  expiresAt: string
  regCode: string
  [property: string]: any
}
