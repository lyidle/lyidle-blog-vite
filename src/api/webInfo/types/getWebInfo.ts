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
  touristCounts: string
  webCreatedAt: string
  webTotalPages: string
  webTotalPersonCounts: string
  webTotalWords: string
  webUpdatedAt: string
  webUserCounts: string
  [property: string]: any
}
