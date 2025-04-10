import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入 模型
const { Setting } = require("@/db/models")
const router = express.Router()
// 引入redis 设置缓存
import { delKey } from "@/utils/redis"
// 不能删除的 设置项
const notDel = ["公告", "版权", "联系方式", "关于", "笔记菜单项"]
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 提取需要的信息
      const { id } = req.params

      // 汇总 错误信息
      if (!id) return res.result(void 0, "id是必传项", false)
      const findSetting = await Setting.findByPk(id)
      if (!findSetting)
        return res.result(void 0, "没有找到对应的设置信息~", false)

      if (notDel.includes(findSetting.name))
        return res.result(
          void 0,
          `删除设置信息失败,不能删除名字为: ${findSetting.name} 的设置项`,
          false
        )
      await findSetting.destroy()
      // 清除缓存
      await delKey(`setting:${findSetting.dataValues.name}`)
      res.result(void 0, "删除设置信息成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "删除设置信息失败~", false)
      )
    }
  }
)
// 挂载路由
export default router
