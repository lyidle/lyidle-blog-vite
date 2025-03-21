// 定义排序顺序的类型，只能是 "desc" 或 "asc"
export type orderType = "desc" | "asc"

// 定义排序字段的类型，只能是 "createdAt" 或 "updatedAt"
export type orderKeyType = "createdAt" | "updatedAt"

// 定义排序配置项的类型，包含排序顺序和排序字段
export type orderObjItem = {
  order: orderType // 排序顺序
  key: orderKeyType // 排序字段
}

// 定义排序配置对象的类型，包含多个排序配置项
export interface orderObjType {
  like: orderObjItem // "like" 排序配置
  new: orderObjItem // "new" 排序配置
}

// 提取 orderObjType 的键的联合类型，即 "like" | "new"
export type OrderKeys = keyof orderObjType

// 显示回复框 自定义事件 的 参数类型
export type handlerReplyType = {
  showId: number
  fromId: number
  fromNickName: string
  callback?: () => void
}
