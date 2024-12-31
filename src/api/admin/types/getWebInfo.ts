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
  totalWords: number
  touristCounts: number
  webCreatedAt: string
  webTotalPages: number
  webTotalPersonCounts: number
  webUpdatedAt: string
  webUserCounts: number
  [property: string]: any
}
