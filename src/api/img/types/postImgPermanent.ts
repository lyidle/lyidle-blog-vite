/**
 * Request
 */
export interface PostImgPermanent {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  successImg: SuccessImg[]
  tempImgNull: string[]
  [property: string]: any
}

export interface SuccessImg {
  origin: string
  url: string
  [property: string]: any
}
