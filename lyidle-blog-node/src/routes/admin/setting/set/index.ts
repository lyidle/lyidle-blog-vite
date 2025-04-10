import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
const router = express.Router()
// 引入 模型
const { Setting, User, Role } = require("@/db/models")
// 引入redis 设置缓存
import { setKey, getKey } from "@/utils/redis"

const default_owner = process.env.default_owner
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  // 提取需要的信息
  const { name, content } = req.body
  // 有缓存 不重复设置 缓存没有 的化 模型也拦截了
  if (await getKey(`setting:${name}`))
    return res.result(void 0, `${name}信息已设置~`, false)
  try {
    // 汇总 错误信息
    const errorArray: string[] = []
    if (!name) errorArray.push("name是必传项")
    if (!content) errorArray.push("content或者jsonContent是必传项")
    if (errorArray.length) return res.result(void 0, errorArray, false)
    let ownerId = await getKey("ownerId")
    if (!ownerId) {
      const findUser = await User.findOne({
        attributes: ["id"],
        include: [
          {
            model: Role,
            attributes: ["id"],
            through: { attributes: [] },
            where: { name: default_owner },
            required: true,
          },
        ],
      })
      if (!findUser)
        return res.result(void 0, `设置${name}失败,没有初始化owner账户~`, false)
      ownerId = findUser.id
      await setKey("ownerId", ownerId)
    }
    const setData: any = { name, content, userId: ownerId }

    const { dataValues } = await Setting.create(setData)

    // 设置缓存
    await setKey(`setting:${name}`, dataValues)
    res.result(void 0, `设置${name}成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, `设置${name}失败~`, false)
    )
  }
})
// 挂载路由
export default router
