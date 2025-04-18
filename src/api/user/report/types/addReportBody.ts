/**
 * Request
 */
export interface AddReportBody {
  /**
   * 文章
   */
  articleId?: number
  /**
   * 设置
   */
  settingId?: number
  /**
   * 评论需要articleId或settingId
   */
  commentId?: number
  /**
   * 描述
   */
  desc: string
  /**
   * 消息
   */
  msgId?: number
  /**
   * 举报的分类
   */
  name: string
  /**
   * 被举报的人
   */
  targetUserId: number
  /**
   * "article"|"comment"|"msg"|"user"
   */
  type: "article" | "comment" | "msg" | "user" | ""
  [property: string]: any
}
