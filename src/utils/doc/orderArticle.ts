export interface Article {
  author?: string
  category?: string
  createdAt?: string
  desc?: string
  id?: number
  poster?: null | string
  tags?: string[]
  title?: string
  updatedAt?: string
  userId?: number
  [property: string]: any
}

// 排序函数
export const orderArticle = (
  articles: Article[],
  descend: boolean = false,
  key: keyof Article = "createdAt"
): Article[] => {
  return articles.slice().sort((a, b) => {
    const valA = a[key]
    const valB = b[key]

    if (typeof valA === "string" && typeof valB === "string") {
      return descend ? valB.localeCompare(valA) : valA.localeCompare(valB)
    } else if (typeof valA === "number" && typeof valB === "number") {
      return descend ? valB - valA : valA - valB
    }
    return 0
  })
}
