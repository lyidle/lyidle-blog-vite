/**
 * Request
 */
export interface Request {
  /**
   * 账号
   */
  account: string
  /**
   * 根据邮箱发送的代码
   */
  code: string
  /**
   * 确认密码
   */
  confirmPassword: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 显示的名称
   */
  nickName: string
  /**
   * 密码
   */
  password: string
  [property: string]: any
}
