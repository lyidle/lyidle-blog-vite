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
   * 当前页默认值1
   */
  currentPage?: string
  /**
   * 描述
   */
  desc?: string
  /**
   * ID 编号
   */
  id?: number
  /**
   * 一页显示的数量10
   */
  pageSize?: string
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
