/**
 * Request
 */
export interface AddArticleBody {
  category: string
  content: string
  desc: string
  imgUrls?: string[]
  length: number
  poster?: string
  tags: string[]
  title: string
  articleId: string
  [property: string]: any
}
