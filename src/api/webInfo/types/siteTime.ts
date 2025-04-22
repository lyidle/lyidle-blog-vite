/**
 * Request
 */
export interface SiteTime {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  content: string
  createdAt: string
  id: number
  updatedAt: string
  [property: string]: any
}
