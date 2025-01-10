/**
 * Request
 */
export interface GetAnnounce {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  announce: Announce
  region: null | Region
  [property: string]: any
}

export interface Announce {
  content?: string
  id: number
  name: string
  [property: string]: any
}

export interface Region {
  city: string
  country: string
  province: string
  userIp: string
  [property: string]: any
}
