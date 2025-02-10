import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 设置 redis 缓存
import { delKey } from "@/utils/redis"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 模型
const { Menu } = require("@/db/models")
const router = express.Router()

// 更新 菜单
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, icon, layout, role, parentId, isBin } = req.body

    // 没有 id、name 返回失败
    if ((id !== 0 && !id) || !name)
      return res.result(void 0, "id、name是必传项哦~", false)

    if (icon! && layout! && role! && parentId! && isBin)
      return res.result(
        void 0,
        "更新菜单至少需要icon、layout、role、parentId、isBin其中的一个参数哦~",
        false
      )

    try {
      // 存储查询到的结果

      // 通过id 查找
      let findMenu = await Menu.findByPk(id)

      if (!findMenu)
        return res.result(void 0, "没有找到需要更新的菜单哦~", false)

      // 找到 了 则更新
      name && findMenu.set("name", name)
      icon && findMenu.set("icon", icon)
      layout && findMenu.set("layout", layout)
      role && findMenu.set("role", role)
      parentId && findMenu.set("parentId", parentId)
      isBin && findMenu.set("isBin", isBin)

      const { dataValues } = await findMenu.save()
      // 得到 roles
      const roles = dataValues.role
      if (roles && roles.length) {
        // 清除 redis 缓存
        await Promise.all(roles.map((item: string) => delKey(`menu:${item}`)))
      }

      res.result(void 0, "更新菜单成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新菜单失败~", false)
      )
    }
  }
)
export default router
