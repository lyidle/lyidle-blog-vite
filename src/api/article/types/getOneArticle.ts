/**
 * Request
 */
export interface GetOneArticle {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  author: string
  carousel: number
  category: string
  content: string
  createdAt: string
  desc: string
  id: number
  isBin: number
  length: number
  poster: null | string
  tags: string[]
  title: string
  updatedAt: string
  userId: number
  [property: string]: any
}
