export interface SearchArticleQuery {
  /**
   * 作者
   */
  author?: string
  /**
   * 分类
   */
  category?: string
  /**
   * 描述
   */
  desc?: string
  /**
   * ID 编号
   */
  id?: number
  /**
   * 标签
   */
  tags?: string
  /**
   * 标题
   */
  title?: string
  [property: string]: any
}
