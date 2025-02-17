/**
 * Request，至少要有一个
 */
export interface DeleteBody {
  /**
   * ID 编号
   */
  id?: number
  [property: string]: any
}
