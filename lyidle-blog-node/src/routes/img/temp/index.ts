import express from "express"
import { join } from "path"
import { existsSync, readFileSync } from "fs"

// 引入 api
const router = express.Router()

// 生成的文件 相对于什么路径
const outputRelative = join(__dirname, "../../../images/temp")

router.get("/:author/:filename", async (req, res) => {
  const { author, filename } = req.params
  const filePath = join(outputRelative, author, filename)
  try {
    const file = await readFileSync(filePath)

    // 设置 Content-Type，告诉客户端返回的是图片数据
    const fileExtension = filename.split(".").pop()!.toLowerCase()
    const mimeTypes: { [key in string]: string } = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      svg: "image/svg+xml",
    }

    const contentType = mimeTypes[fileExtension!] || "application/octet-stream"

    res.setHeader("Content-Type", contentType)

    // 发送文件数据
    res.send(file)
    return
  } catch (error) {
    res.status(404).json({ message: "当前图片文件不存在~" })
    return
  }
})
export default router
