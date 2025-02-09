export interface AccordionMenuItem {
  id: string | number // 菜单项的唯一标识
  name: string // 菜单项的名称
  to?: string // 路由路径（可选）
  icon: string // 图标名称或路径
  children?: AccordionMenuItem[] // 子菜单项（可选）
}

export type AccordionMenuList = AccordionMenuItem[]
