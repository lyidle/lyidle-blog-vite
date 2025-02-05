import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 把临时图片转为永久图片的 函数 文章专用
import { tempImgLinkToPermantLink } from "@/utils/io/compress/tempImgLinkToPermantLink"
import { join, resolve } from "path"
const router = express.Router()
router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tempImg } = req.body
      const { account } = req.auth
      if (Array.isArray(tempImg) && !tempImg.length)
        return res.result(void 0, "没有需要转换的图片哦~", false)
      // 生成的文件 的路径
      const outputRelative = join(
        __dirname,
        `../../../../assets/images/${account}/md/content`
      )

      // 静态文件路径
      const staticPath = resolve(__dirname, "../../../../")
      // 处理 临时图片 转为 永久
      const result = await tempImgLinkToPermantLink(
        tempImg,
        outputRelative,
        staticPath
      )

      res.result({ ...result }, "图片转换成功~")
    } catch (error) {
      return res.result(
        { tempImgNull: [], successImg: [] },
        "图片转换失败哦~",
        false
      )
    }
  }
)

export default router
