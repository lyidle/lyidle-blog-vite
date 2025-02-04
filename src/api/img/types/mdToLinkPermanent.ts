/**
 * Request
 */
export interface MdToLinkPermanent {
  code: number
  data?: Data
  message: string[] | string
  [property: string]: any
}

export interface Data {
  successImg: SuccessImg[]
  tempImgNull: TempImgNull[]
  [property: string]: any
}

export interface SuccessImg {
  origin: string
  url: string
  [property: string]: any
}

export interface TempImgNull {
  origin: string
  url: string
  [property: string]: any
}
