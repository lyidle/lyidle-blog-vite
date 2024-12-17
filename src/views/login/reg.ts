// 正则
export const accountReg = /^.{3,}/
// 密码
export const passReg =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@,_.])[a-zA-Z0-9$@,_.]{6,12}$/
// 邮箱
export const emailReg =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// 验证码正则
export const codeReg = /^[0-9]{6}$/
