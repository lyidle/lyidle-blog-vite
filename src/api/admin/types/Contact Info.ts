/**
 * Request
 */
export interface ContactInfo {
  code: number
  data: Data
  message: any[] | boolean | number | { [key: string]: any } | null | string
  [property: string]: any
}

export interface Data {
  content: Content
  id: number
  name: string
  [property: string]: any
}

export interface Content {
  BiliBili: string
  email: string
  QQ: string
  weChat: string
  [property: string]: any
}
