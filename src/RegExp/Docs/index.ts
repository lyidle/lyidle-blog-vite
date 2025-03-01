// 文章上传和修改的正则
// 标题
export const titleReg = {
  reg: /^.{1,25}$/,
  msg: "文章标题长度必须在1-25之间",
}
// 分类
export const categoryReg = {
  reg: /^.{1,10}$/,
  msg: "文章分类长度必须在1-10之间",
}
// 标签
export const tagsReg = {
  itemReg: /^.{1,10}$/,
  itemMsg: "文章标签长度需要在1-10之间",
  totalMin: 1,
  totalMax: 10,
  msg: "文章标签个数需要在1-10之间",
}

// 内容
export const contentReg = {
  min: 100,
  msg: "文章内容至少要有100字",
}

// 描述
export const descReg = {
  reg: /^.{1,255}$/,
  msg: "文章描述长度必须在1-255之间",
}
