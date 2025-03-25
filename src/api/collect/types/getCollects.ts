/**
 * Request
 */
export interface GetCollects {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  count: number
  userIds: number[]
  [property: string]: any
}
