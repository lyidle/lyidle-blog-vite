/**
 * Request
 */
export interface UpdateUserBody {
  account: string
  avatar: string
  code: string
  confirmPassword: string
  email: string
  nickName: string
  password: string
  signer: string
  [property: string]: any
}
