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
  bannerImg?: null | FluffyBannerImg
  icon: string
  id: number
  menuId?: number
  name: string
  to: null | string
  children?: Child[]
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
