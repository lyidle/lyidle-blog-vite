export interface menuData {
  id: number
  name: string
  to: string
}
export interface menuListType {
  id: number
  title: string
  icon: string
  to: string
  data?: menuData[]
}
