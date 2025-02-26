/**
 * Request
 */
export interface UpdateUserBody {
  account: string
  avatar: string | null
  code: string
  confirmPassword: string
  email: string
  nickName: string
  password: string
  signer: string | null
  [property: string]: any
}
