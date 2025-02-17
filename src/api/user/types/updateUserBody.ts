/**
 * Request
 */
export interface UpdateUserBody {
  account: string
  avater: null
  email: string
  id?: number
  nickName: string
  pwd: string
  roles: string[]
  signer: null
  [property: string]: any
}
