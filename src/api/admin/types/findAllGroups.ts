/**
 * Request
 */
export interface FindAllGroups {
  code: number
  data: Datum[]
  message: string
  [property: string]: any
}

export interface Datum {
  children: Child[]
  createdAt: string
  desc: null
  id: number
  name: string
  updatedAt: string
  [property: string]: any
}

export interface Child {
  createdAt: string
  desc: null
  id: number
  name: string
  updatedAt: string
  [property: string]: any
}
