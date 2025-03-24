// 侧边栏数据
export const asideData = [
  {
    name: "全局设置",
    title: "个性化设置",
  },
  {
    name: "用户编辑",
    title: "用户编辑",
  },
  {
    name: "test2",
  },
  {
    name: "test3",
  },
  {
    name: "test4",
  },
  {
    name: "test5",
  },
  {
    name: "test6",
  },
  {
    name: "test7",
  },
  {
    name: "test8",
  },
  {
    name: "test9",
  },
]

// 保存的 侧边栏对应的索引
export const asideDataMap: { [key: string]: number } = {}
// 生成索引 映射
asideData.forEach((item, index) => {
  asideDataMap[item.name] = index
})
