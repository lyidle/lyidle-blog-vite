export interface Setting {
  content: string[] | { [key: string]: any } | string
  id?: number
  name: string
  [property: string]: any
}
