import { Router } from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { isTourist } from "@/middleware/auth"
// 引入redis
import { getKey, setKey } from "@/utils/redis"
// 引入 uuidV4  生成临时文件的 id
import { v4 as uuidV4 } from "uuid"
// 设置 游客 token
const jwt = require("jsonwebtoken")
// 引入模型
const { Visitor } = require("@/db/models")
const router = Router()

router.get("/", async (req, res, next) => {
  // 排除用户
  if (req.auth?.id) return res.result(void 0, "访客登记成功")
  // 生成 id
  const id = uuidV4()
  try {
    // jwt.sign(数据, 加密字符串, 配置对象)
    const token = jwt.sign(id, process.env.jwt_hash, {
      algorithm: "HS256",
    })
    const [visitor, created] = await Visitor.findOrCreate({
      where: { name: token },
      defaults: { name: token },
    })

    // 是创建的 则 增加 访客数量
    if (created) {
      // 获取到访客数量
      let touristCounts = await getKey("touristCounts")
      // 访客数量 + 1
      await setKey("touristCounts", touristCounts + 1)
    }

    return res.result(token, "访客登记成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "访客登记失败", false)
    )
  }
})
router.delete(
  "/",
  [isTourist],
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body
    try {
      const result = await Visitor.findOne({ where: { name } })

      // 有值 去掉对应的标识
      if (!result) return res.result(void 0, "访客注销失败")
      await result.destroy()

      // 获取到访客数量
      let touristCounts = +(await getKey("touristCounts"))
      // 自减
      --touristCounts
      // 访客数量 + 1

      await setKey("touristCounts", touristCounts || 0)
      return res.result(void 0, "访客注销成功")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "访客注销失败", false)
      )
    }
  }
)
export default router
