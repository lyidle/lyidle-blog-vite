// 构建错误函数
export class myError {
  message?: string
  name: string
  constructor(name: string, message?: string) {
    this.message = message
    this.name = name
  }
}
