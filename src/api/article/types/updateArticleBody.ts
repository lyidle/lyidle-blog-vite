/**
 * Request
 */
export interface UpdateArticleBody {
  carousel?: string
  category: string
  content: string
  desc: string
  id: number
  length: string
  poster?: string
  tags: string[]
  title: string
  [property: string]: any
}
