/**
 * Request
 */
export interface GetMenuList {
  data?: Datum[]
  message: string
  [property: string]: any
}

export interface Datum {
  children?: Child[]
  icon?: string
  id?: number
  isBin?: number
  parentId?: number | null
  roles?: string[]
  layout?: null | Layout
  name: string
  to: null | string
  [property: string]: any
}

export interface Child {
  children?: Child[]
  icon?: string
  id?: number
  isBin?: number
  parentId?: number | null
  roles?: string[]
  layout?: null | Layout
  name: string
  to: null | string
  [property: string]: any
}

export interface Layout {
  // 顶部导航的 动态菜单 的宽度
  topnavWidth?: string
  topnavDirection?: string
  [property: string]: any
}
