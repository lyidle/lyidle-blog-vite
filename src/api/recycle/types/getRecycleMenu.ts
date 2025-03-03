/**
 * Request
 */
export interface GetRecycleMenu {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  menus: Menu[]
  pagination: Pagination
  [property: string]: any
}

export interface Menu {
  createdAt: string
  icon: null | string
  id: number
  isBin: null | string
  layout: null | MenuLayout
  name: string
  parentId: number | null
  to: string
  updatedAt: string
  [property: string]: any
}

export interface MenuLayout {
  topnavDirection?: string
  topnavWidth?: string
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}
