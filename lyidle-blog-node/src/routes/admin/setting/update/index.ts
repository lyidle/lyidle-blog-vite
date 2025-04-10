import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
const router = express.Router()
// 引入 模型
const { Setting } = require("@/db/models")
// 引入redis 设置缓存
import { delKey, setKey } from "@/utils/redis"
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  // 提取需要的信息
  const { name, content, id } = req.body
  // 错误信息
  if (!id) return res.result(void 0, "id是必传项~", false)
  try {
    const findSetting = await Setting.findByPk(id)
    if (!findSetting)
      return res.result(void 0, `没有找到id为：${id}的设置项~`, false)

    if (content) await findSetting.set("content", content)
    if (name) await findSetting.set("name", name)

    const { dataValues } = await findSetting.save()

    // 删除 旧的缓存
    await delKey(`setting:${findSetting.dataValues.name}`)
    // // 设置缓存
    await setKey(`setting:${name}`, dataValues)
    res.result(void 0, `修改id为：${id}的设置项成功~`)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, `修改id为：${id}的设置项失败~`, false)
    )
  }
})
// 挂载路由
export default router
