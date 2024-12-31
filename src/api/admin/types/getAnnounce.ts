/**
 * Request
 */
export interface GetAnnounce {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  announce: null | string
  region: null | Region
  [property: string]: any
}

export interface Region {
  city: string
  country: string
  province: string
  userIp: string
  [property: string]: any
}
