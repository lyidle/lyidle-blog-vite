/**
 * Request
 */
export interface AddReport {
  code: number
  data?: null | Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  createdAt: string
  desc: string
  filterType: string
  id: number
  targetType: string
  targetUserId: number
  updatedAt: string
  userId?: number | null
  [property: string]: any
}
