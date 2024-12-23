/**
 * Request
 */
export interface GetAnnounce {
  data: Data
  message: string
  status: boolean
  [property: string]: any
}

export interface Data {
  announce: string
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
