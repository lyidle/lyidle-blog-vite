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
  touristCounts: number
  webCreatedAt: string
  webTotalPages: number
  webTotalPersonCounts: number
  webTotalWords: number
  webUpdatedAt: null | string
  webUserCounts: number
  [property: string]: any
}
