import { apiReqType } from "@/api/config"
// 返回的 banner 页 图标类型
export interface bannerImgType {
  light: string
  dark: string
  height?: string
  fixed: boolean
}
// 返回的二级菜单类型
export interface menuData {
  depId: number
  oneId?: number
  name: string
  to: string
  icon: string
  bannerImg?: bannerImgType
}
// 大屏一级菜单的布局
export interface menuLayout {
  top?: string
  left?: string
  width?: string
  gap?: string
}
// 返回的菜单类型
export interface menuListType {
  id: number
  title: string
  icon: string
  to: string
  // 大屏一级菜单的布局
  layout?: menuLayout
  bannerImg?: bannerImgType
  children?: menuData[]
}
// reqmenu 的返回类型
export interface reqMenuListType extends apiReqType {
  data: menuListType[]
}
