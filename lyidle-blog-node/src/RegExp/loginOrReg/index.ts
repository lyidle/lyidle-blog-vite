// 正则
// 账号
export const accountReg = {
  reg: /^.{1,32}$/,
  msg: "账号长度必须在1-32之间",
}
// 名称
export const nickNameReg = {
  reg: /^.{1,32}$/,
  msg: "昵称长度必须在1-32之间",
}
// 密码
export const pwdReg = {
  reg: /^.{6,50}$/,
  msg: "密码长度长度必须在6-50之间",
}
// 邮箱
export const emailReg = {
  reg: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  msg: "范例:123@qq.com,邮箱格式不正确~",
}
// 验证码
export const codeReg = {
  reg: /^[0-9]{6}$/,
  msg: "验证码格式必须要是0-9之间的六位数",
}
