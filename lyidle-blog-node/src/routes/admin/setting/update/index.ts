import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
const router = express.Router()
// 引入 模型
const { Setting } = require("@/db/models")
// 引入redis 设置缓存
const { setKey } = require("@/utils/redis")
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 提取需要的信息
    const { name, content } = req.body
    try {
      // 汇总 错误信息
      const errorArray = []
      if (!name) errorArray.push("name是必传项哦~")
      if (!content) errorArray.push("content或者jsonContent是必传项哦~")
      if (errorArray.length) return res.result(void 0, errorArray, false)

      const findSetting = await Setting.findOne({ where: { name } })
      if (!findSetting)
        return res.result(void 0, `没有找到${name}设置项~`, false)

      if (content) await findSetting.set("content", content)

      const { dataValues } = await findSetting.save()

      // 设置缓存
      await setKey(`setting:${name}`, dataValues)
      res.result(void 0, `修改${name}成功~`)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, `修改${name}失败~`, false)
      )
    }
  }
)
// 挂载路由
export default router
