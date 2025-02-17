/**
 * Request
 */
export interface CreateUserBody {
  account: string
  email: string
  nickName: string
  password: string
  [property: string]: any
}
