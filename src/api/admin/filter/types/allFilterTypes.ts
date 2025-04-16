/**
 * Request
 */
export interface AllFilterTypes {
  code: number
  data: Datum[]
  message: string[] | string
  [property: string]: any
}

export interface Datum {
  desc?: null | string
  name: string
  [property: string]: any
}
