// 定义排序顺序的类型，只能是 "desc" 或 "asc"
export type orderType = "desc" | "asc"

// 定义排序字段的类型，只能是 "createdAt" 或 "updatedAt"
export type orderKeyType = "like" | "new" | "late"
// 排序的 对象 类型
export type orderObjType = {
  order: orderType
  key: orderKeyType
}
// 构建的 orderMap 类型
export type typeOrderMap = {
  desc: "asc"
  asc: "desc"
}
// 显示回复框 自定义事件 的 参数类型
export type handlerReplyType = {
  showId: number
  fromId: number
  fromNickName: string
  callback?: () => void
}
