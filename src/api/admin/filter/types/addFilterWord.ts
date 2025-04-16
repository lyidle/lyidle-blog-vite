/**
 * Request
 */
export interface AddFilterWord {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  createdAt: string
  type: string
  updatedAt: string
  word: string
  [property: string]: any
}
