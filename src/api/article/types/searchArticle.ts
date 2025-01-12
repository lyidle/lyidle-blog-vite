/**
 * Request
 */
export interface SearchArticle {
  code: number
  data?: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  author: string
  category: string
  desc: string
  id: number
  tags: string[]
  title: string
  [property: string]: any
}
