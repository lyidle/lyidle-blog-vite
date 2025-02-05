import { jwtMiddleware } from "@/middleware/auth"
import { join, resolve } from "path"
import { existsSync } from "fs"
import { unlink } from "fs/promises" // 以异步方式删除文件
import express, { Request, Response, NextFunction } from "express"

const router = express.Router()
const api_prefix = process.env.api_prefix!
const staticPath = resolve(__dirname, "../../../") // 计算静态资源的根目录路径

router.delete(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { urls } = req.body
    const successMap: string[] = [] // 存储成功删除的文件路径
    const errorMap: string[] = [] // 存储删除失败的文件路径

    // 确保 urls 是一个非空数组
    if (Array.isArray(urls) && urls.length) {
      await Promise.all(
        urls.map(async (item) => {
          try {
            // 处理 URL 路径，将 API 前缀去掉
            const handlerPath = item.replace(api_prefix.replace("/", "\\"), "")

            // 确保路径指向 `assets` 目录，防止误删其他文件
            if (handlerPath.startsWith("\\assets")) {
              const filePath = join(staticPath, handlerPath) // 计算文件的完整路径

              // 检查文件是否存在
              if (existsSync(filePath)) {
                await unlink(filePath) // 异步删除文件
                successMap.push(item) // 记录成功删除的文件
              } else {
                errorMap.push(item) // 记录未找到的文件
              }
            } else {
              errorMap.push(item) // 记录非法路径
            }
          } catch (error) {
            console.error(`删除文件失败: ${item}`, error) // 记录删除失败的错误信息
            errorMap.push(item) // 记录删除失败的文件
          }
        })
      )
    }

    // 返回删除结果
    res.result({ successMap, errorMap }, "删除文件完成")
  }
)

export default router
