// 正则
// 账号
export const accountReg = {
  reg: /^.{3,}$/,
  msg: "账号长度最少要是三位哦~",
}
// 名称
export const nickNameReg = {
  reg: /^.{1,}/,
  msg: "用户名长度最少要是一位哦~",
}
// 密码
export const pwdReg = {
  reg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@,_.])[a-zA-Z0-9$@,_.]{6,12}$/,
  msg: "密码需要必须包含数字、字母小写与大写，和特殊字符($@,_.)中的一个~",
}
// 邮箱
export const emailReg = {
  reg: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  msg: "邮箱格式不正确哦~",
}
// 验证码
export const codeReg = {
  reg: /^[0-9]{6}$/,
  msg: "验证码格式不正确哦~",
}
