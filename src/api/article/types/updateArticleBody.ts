/**
 * Request
 */
export interface UpdateArticleBody {
  category: string
  content: string
  desc: string
  id: number
  imgUrls?: string[]
  length: number
  poster?: string
  tags: string[]
  title: string
  [property: string]: any
}
