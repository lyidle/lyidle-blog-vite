/**
 * Request
 */
export interface PostTempImgFiles {
  code: number
  data: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  errFiles: string[]
  succMap: SuccMap
  [property: string]: any
}

export interface SuccMap {
  "头像.jpg": string
  [property: string]: any
}
