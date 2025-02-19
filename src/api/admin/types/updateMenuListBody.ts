/**
 * Request
 */
export interface UpdateMenuListBody {
  bannerImg?: BannerImg
  icon?: string
  id: number
  layout?: Layout
  name: string
  parentId: number | null
  roles?: string[]
  to?: string
  [property: string]: any
}

export interface BannerImg {
  dark?: string
  height?: string
  light?: string
  [property: string]: any
}

export interface Layout {
  topnavDirection?: string
  topnavWidth?: string
  [property: string]: any
}
