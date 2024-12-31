/**
 * Request
 */
export interface GetWebInfo {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  webTotalWords: number
  touristCounts: number
  webCreatedAt: string
  webTotalPages: number
  webTotalPersonCounts: number
  webUpdatedAt: null | string
  webUserCounts: number
  [property: string]: any
}
