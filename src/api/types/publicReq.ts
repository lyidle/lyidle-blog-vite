/**
 * Request
 */
export interface PublicReq {
  code: number
  message: string[] | string
  [property: string]: any
}
