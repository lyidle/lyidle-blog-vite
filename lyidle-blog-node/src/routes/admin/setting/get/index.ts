import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入 模型
const { Setting } = require("@/db/models")
const router = express.Router()
// 引入redis 设置缓存
const { setKey, getKey } = require("@/utils/redis")

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  // 提取需要的信息
  const { name } = req.query
  // 判断有无相关缓存
  const cacheValue = await getKey(`setting:${name}`)
  if (cacheValue) {
    // 展示时 把 对象的属性 解析后展示
    try {
      const handler = cacheValue
      handler.content = JSON.parse(handler.content)
      return res.result(handler, `获取${name}成功~`)
    } catch (error) {
      return res.result(cacheValue, `获取${name}成功~`)
    }
  }
  try {
    // 汇总 错误信息
    if (!name) return res.result(void 0, "name是必传项哦~", false)
    const { dataValues } = await Setting.findOne({ where: { name } })
    // 成功设置缓存
    const result = await setKey(`setting:${name}`, {
      ...JSON.parse(JSON.stringify(dataValues)),
    })
    // 展示时 把 对象的属性 解析后展示
    try {
      const handler = result
      handler.content = JSON.parse(handler.content)
      return res.result(handler, `获取${name}成功~`)
    } catch (error) {
      res.result(result, `获取${name}成功~`)
    }
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, `获取${name}失败~`, false)
    )
  }
})
// 挂载路由
export default router
