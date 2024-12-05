// 引入基础配置
import raw from "@/config.json"
// 引入nanoid 来进行生成 加盐
import { nanoid } from "nanoid"
// 操作文件
import { writeFileSync } from "fs"
import { resolve } from "path"
let config = raw
const { EXPRESS } = config
// 查看有没有加盐
const initHash = () => {
  if (!EXPRESS.hash) {
    const hash = nanoid()
    EXPRESS.hash = hash
    try {
      writeFileSync(
        resolve(__dirname, "../../config.json"),
        JSON.stringify(config)
      )
    } catch (error) {
      throw Error("init:生成hash失败~")
    }
  }
}
module.exports = initHash
