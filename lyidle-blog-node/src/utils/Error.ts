// 构建错误函数
export default class myError {
  message?: string
  name: string
  constructor(name: string, message?: string) {
    this.message = message
    this.name = name
  }
}
