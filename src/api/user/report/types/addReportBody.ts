/**
 * Request
 */
export interface AddReportBody {
  /**
   * 文章
   */
  articleId?: number
  /**
   * 评论
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
