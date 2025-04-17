/**
 * Request
 */
export interface ManagerUpdateUserBody {
  account: string
  avatar?: null | string
  email: string
  id: number
  nickName: string
  signer?: null | string
  [property: string]: any
}
