import { Layout } from "@/api/admin/types/getMenuList"

export interface MenuItem {
  name: string // 菜单项的名称
  to?: string
  layout?: Layout
  children?: MenuItem[] // 子菜单项的名称列表
}

export type MenuData = MenuItem[]

export type directionType = "left" | "right" | string
