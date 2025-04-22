export interface Setting {
  content: string[] | { [key: string]: any } | string
  id?: number
  name: string
  link?: string
  [property: string]: any
}
