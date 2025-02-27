/**
 * Request
 */
export interface GetBannerImgPagination {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  banners: Banner[]
  pagination: Pagination
  [property: string]: any
}

export interface Banner {
  createdAt: string
  dark: null | string
  height: null | string
  id: number
  isBin: null | string
  light: null | string
  name: string
  updatedAt: string
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
