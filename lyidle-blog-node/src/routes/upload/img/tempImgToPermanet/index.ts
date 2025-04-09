import express from "express"
// 引入类型
import type { NextFunction, Request, Response } from "express"
// 引入 jwt
import { isAdmin } from "@/middleware/auth"
// 引入 把临时图片转为永久图片的 函数
import { tempImgLinkToPermantLink } from "@/utils/io/compress/tempImgLinkToPermantLink"
import { join, resolve } from "path"
// 引入 模型
const { User } = require("@/db/models")
const router = express.Router()

const handlerTransform = async (
  req: Request,
  res: Response,
  next: NextFunction,
  isUserAccount: boolean = true
) => {
  // 得到临时图片 和 作者 与 生成路径
  let { tempImg, account, path } = req.body

  // 判断 有无需要转换的 图片
  if (Array.isArray(tempImg) && !tempImg.length)
    return res.result(void 0, "没有需要转换的图片", false)

  // 没有 作者 和 路径
  if (isUserAccount && (!account || !path)) {
    return res.result(
      void 0,
      "临时图片转永久图片，作者和路径是必须要有的参数",
      false
    )
  }

  // 不需要传入 account参数 path 不存在
  if (!isUserAccount && !path) {
    return res.result(void 0, "临时图片转永久图片，路径是必须要有的参数", false)
  }

  // 存在 account 判断是否真实存在
  if (isUserAccount) {
    // 查找用户是否存在
    const fndAccount = await User.findOne({
      where: { account },
      attributes: ["account", "id"],
    })
    account = fndAccount.id
    // 不存在返回
    if (fndAccount === null)
      return res.result(
        void 0,
        "临时图片转永久图片，用户不存在或在垃圾桶里",
        false
      )
  }

  try {
    // 生成的文件 的路径
    const outputRelative = join(
      __dirname,
      `../../../../assets/images/${account || ""}`,

      // 先把所有的 斜杆转为 /
      path.replace(/[\\/]/g, "/")
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
      "图片转换失败",
      false
    )
  }
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  await handlerTransform(req, res, next)
})

// 需要 admin 权限 只需要传入 path 和 tempImg
router.post(
  "/manager",
  [isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    await handlerTransform(req, res, next, false)
  }
)

export default router
