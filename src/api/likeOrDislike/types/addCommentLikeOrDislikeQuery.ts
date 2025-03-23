export interface AddCommentLikeOrDislikeQuery {
  articleId?: number
  /**
   * "like" | "normal"
   */
  likeType?: "like" | "normal" | "dislike"
  [property: string]: any
}
