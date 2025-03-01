import { isDir } from "@/utils/io/isDir"
import express, { Request, Response, NextFunction } from "express"
// 引入 uuidV4  文件的 id
import { v4 as uuidV4 } from "uuid"
import { extname, join } from "path"

// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"

const multer = require("multer")
const router = express.Router()

// api 的前缀
const api_prefix = process.env.api_prefix || "/api"

// multer 中间件处理
const multerPath = async (req: Request, res: Response, next: NextFunction) => {
  const { account } = req.auth
  const uploadPath = join(
    __dirname,
    `../../../../../assets/images/temp/${account}`
  )

  // 确保路径存在
  isDir([uploadPath])
  // 设置存储配置
  const storage = multer.diskStorage({
    // 动态设置文件保存路径
    destination: (req: any, file: any, cb: any) => {
      cb(null, uploadPath)
    },
    // 动态设置文件名（保留原始扩展名）
    filename: (req: any, file: any, cb: any) => {
      const uniqueId = uuidV4() // 使用 uuidV4 生成唯一 ID
      const ext = extname(file.originalname) // 获取文件扩展名
      const path = `${uniqueId}${ext}`
      cb(null, path)
    },
  })

  // 使用 multer 配置存储方式
  const upload = multer({ storage }).fields([{ name: "file[]" }])

  upload(req, res, (err: any) => {
    if (err) {
      return res.result(err, "文件上传失败哦", false)
    }
    next()
  })
}

router.post(
  "/",
  multerPath,
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { account } = req.auth
    try {
      // @ts-ignore
      const files = req.files["file[]"] // 获取上传的文件数组

      if (!files || files.length === 0) {
        return res.result(
          { errFiles: [], succMap: {} },
          "上传失败，没有文件",
          false
        )
      }

      // 构建返回值
      const succMap: Record<string, string> = {}
      const errFiles: string[] = []

      files.forEach((file: any) => {
        const originalName = file.originalname // 原始文件名
        if (file.mimetype.startsWith("image/")) {
          // 成功的文件
          const url = join(
            api_prefix,
            `/assets/images/temp/${account}/${file.filename}`
          ) // 文件访问路径
          succMap[originalName] = url
        } else {
          // 不符合要求的文件
          errFiles.push(originalName)
        }
      })

      // 成功的为零
      if (errFiles.length > 0 && !succMap.length)
        // 返回失败结果
        return res.result(
          {
            errFiles,
            succMap,
          },
          "文件上传失败",
          false
        )
      // 返回结果
      res.result(
        {
          errFiles,
          succMap,
        },
        errFiles.length > 0 ? "部分文件上传失败" : "上传文件成功~"
      )
    } catch (error) {
      console.error("文件上传错误", error)
      res.result({ errFiles: [], succMap: {} }, "上传文件出错~", false)
    }
  }
)

export default router
