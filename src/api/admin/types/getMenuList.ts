/**
 * Request
 */
export interface GetMenuList {
  data?: Datum[]
  message: string
  [property: string]: any
}

export interface Datum {
  bannerImg?: null | PurpleBannerImg
  children?: Child[]
  icon: string
  id: number
  parentId: number | null
  role: string[]
  layout?: null | Layout
  name: string
  to: null | string
  [property: string]: any
}

export interface PurpleBannerImg {
  dark?: string
  height?: string
  light?: string
  [property: string]: any
}

export interface Child {
  bannerImg?: null | PurpleBannerImg
  children?: Child[]
  icon: string
  id: number
  parentId: number | null
  role: string[]
  layout?: null | Layout
  name: string
  to: null | string
  [property: string]: any
}

export interface FluffyBannerImg {
  dark?: string
  height?: string
  light?: string
  [property: string]: any
}

export interface Layout {
  left?: string
  top?: string
  width?: string
  [property: string]: any
}
