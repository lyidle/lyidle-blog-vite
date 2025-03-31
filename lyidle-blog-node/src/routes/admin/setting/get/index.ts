import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入redis 设置缓存
import { setKey, getKey } from "@/utils/redis"
import pagination from "./pagination"
// 引入 模型
const { Setting } = require("@/db/models")
const router = express.Router()

// 根据名字 获取 设置表的信息
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  // 提取需要的信息
  const { name } = req.query

  // 判断有无相关缓存
  const cacheValue = await getKey(`setting:${name}`)

  if (cacheValue) {
    return res.result(cacheValue, `获取${name}成功~`)
  }

  try {
    // 汇总 错误信息
    if (!name) return res.result(void 0, "name是必传项", false)
    const findSetting = await Setting.findOne({ where: { name } })

    if (!findSetting) return res.result(void 0, `获取${name}失败~`, false)

    const { dataValues } = findSetting

    // 成功设置缓存
    await setKey(`setting:${name}`, dataValues)
    return res.result(dataValues, `获取${name}成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, `获取${name}失败~`, false)
    )
  }
})

router.use("/manager", pagination)

// 根据id 获取 设置表的信息
router.get(
  "/:settingId",
  async (req: Request, res: Response, next: NextFunction) => {
    // 提取需要的信息
    const settingId = req.params.settingId

    try {
      const findSetting = await Setting.findByPk(settingId)

      if (!findSetting)
        return res.result(void 0, `获取id为：${settingId}的设置失败~`, false)

      const { dataValues } = findSetting

      return res.result(dataValues, `获取${dataValues.name}成功~`)
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, `获取id为：${settingId}的设置失败~`, false)
      )
    }
  }
)
// 挂载路由
export default router
