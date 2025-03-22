/**
 * Request Header View
 */
export type menuItemType = {
  name: string
  to?: string
  // 修改 icon 和 click 展示时需要用到
  icon?: { icon: string; style?: { [key in string]: string } }
  click?: () => void
  hide?: boolean
  [property: string]: any
}
export type MenuItemStyle = {
  left?: string
  width?: string
  pl?: string
  [property: string]: any
}
export type menuView = {
  data: menuItemType[]
  style?: MenuItemStyle
}
