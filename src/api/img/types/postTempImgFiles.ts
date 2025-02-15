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
  succMap: { [key: string]: any }
  [property: string]: any
}
