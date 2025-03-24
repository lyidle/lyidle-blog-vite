export interface AddCommentLikeOrDislikeQuery {
  articleId?: number
  settingId?: number
  /**
   * "like" | "normal" | "dislike"
   */
  likeType?: "like" | "normal" | "dislike"
  [property: string]: any
}
