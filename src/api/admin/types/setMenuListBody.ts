/**
 * Request
 */
export interface SetMenuListBody {
  children?: Child[]
  icon?: string
  layout?: Layout
  name: string
  roles?: string[]
  to: string
  [property: string]: any
}

export interface Child {
  bannerImg?: BannerImg
  icon?: string
  name?: string
  to?: string
  [property: string]: any
}

export interface BannerImg {
  dark: string
  height: string
  light: string
  [property: string]: any
}

export interface Layout {
  left: string
  top: string
  width: string
  [property: string]: any
}
