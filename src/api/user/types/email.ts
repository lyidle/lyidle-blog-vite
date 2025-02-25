/**
 * Request
 */
export interface Email {
  // 测试环境有 生产环境 node 关闭了
  regCode?: number
  expire: number
  message: string[] | string
  [property: string]: any
}
