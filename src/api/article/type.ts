export interface categoryType {
  to: string
  content: string
}
export interface tagsType {
  to: string
  content: string[]
}
export interface carouselItemType {
  id: number | string
  publish: string
  to: string
  category: categoryType
  tags: tagsType
  update: string
  poster?: string
  title: string
  description: string
  active?: boolean
}
export type carouselType = carouselItemType[]
