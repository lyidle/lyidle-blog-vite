/**
 * Request
 */
export interface FindAllSettingsPagination {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  pagination: Pagination
  setting: Setting[]
  [property: string]: any
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  [property: string]: any
}

export interface Setting {
  content: string[] | { [key: string]: any } | string
  id: number
  /**
   * 名称
   */
  name: string
  [property: string]: any
}
