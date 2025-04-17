export interface GetReportQuery {
  /**
   * 当前页默认值1
   */
  currentPage?: number
  /**
   * 是否发送了系统消息，手动发送后标记，或者直接删除掉也行
   */
  isSend?: boolean
  /**
   * 一页显示的数量10
   */
  pageSize?: number
  /**
   * 目标id 对应的type的id
   */
  targetId?: string
  /**
   * article|comment|msg|user
   */
  type?: string
  [property: string]: any
}
