import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 把临时图片转为永久图片的 函数
import { tempImgLinkToPermantLink } from "@/utils/io/compress/tempImgLinkToPermantLink"
import { join, resolve } from "path"
// 引入 模型
const { User } = require("@/db/models")
const router = express.Router()
router.post(
  "/",
  [jwtMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    // 得到临时图片 和 作者 与 生成路径
    const { tempImg, account, path } = req.body

    // 没有 作者 和 路径
    if (!account || !path) {
      return res.result(
        void 0,
        "临时图片转永久图片，作者和路径是必须要有的参数哦~",
        false
      )
    }

    // 查找用户是否存在
    const fndAccount = await User.findOne({
      where: { account },
      attributes: ["account"],
    })

    // 不存在返回
    if (fndAccount === null)
      return res.result(
        void 0,
        "临时图片转永久图片，用户不存在或在垃圾桶里哦~",
        false
      )

    try {
      if (Array.isArray(tempImg) && !tempImg.length)
        return res.result(void 0, "没有需要转换的图片哦~", false)
      // 生成的文件 的路径
      const outputRelative = join(
        __dirname,
        `../../../../assets/images/${account}`,
        path
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
