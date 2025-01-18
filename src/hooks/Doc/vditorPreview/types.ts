// 生成目录树
export interface TocNode {
  level: number // 标题级别（1-6）
  text: string // 标题文本
  id: string // 标题对应的 ID
  children: TocNode[] // 子标题
}
