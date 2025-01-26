/**
 * Request
 */
export interface AddArticleBody {
  category: string
  content: string
  desc: string
  length: string
  poster?: string
  tags: string[]
  tempImg?: string[]
  title: string
  [property: string]: any
}
