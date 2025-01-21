/**
 * Request Header View
 */
export interface PersonMenuList {
  name: string
  to: string
  // 修改 icon 和 click 展示时需要用到
  icon: { icon: string; style?: { [key in string]: string } }
  click?: () => void
  [property: string]: any
}
