/**
 * Request
 */
export interface GetWebInfo {
  data: Data
  message: string
  status: boolean
  [property: string]: any
}

export interface Data {
  totalWordsData: TotalWordsDatum[]
  touristCounts: number
  webCreatedAt: Date | null
  webTotalPages: number
  webTotalPersonCounts: number
  webUpdatedAt: Date | null
  webUserCounts: number
  [property: string]: any
}

export interface TotalWordsDatum {
  id: number
  userInfo: null | UserInfo
  [property: string]: any
}

export interface UserInfo {
  categories: string
  id: number
  pages: number
  tags: string[]
  totalWords: number
  userId: number
  [property: string]: any
}
