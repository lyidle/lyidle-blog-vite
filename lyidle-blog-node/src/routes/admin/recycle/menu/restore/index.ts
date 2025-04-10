import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 清除 菜单 的缓存
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 获取 roles 的函数
import { ReturnRoles } from "@/utils/db/handlerRoles"
// 去重的 函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 模型
const { Menu, Role } = require("@/db/models")
const router = express.Router()

// 恢复菜单
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!id) return res.result(void 0, "恢复菜单失败,id是必传项", false)

  try {
    const findMenu = await Menu.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Role,
          paranoid: false,
          attributes: ["name"], // 只获取角色名称
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
        },
      ],
    })

    if (!findMenu)
      return res.result(void 0, "恢复菜单失败,没有找到菜单数据", false)

    // 恢复 菜单
    const newMenu = await findMenu.restore()
    // 得到 roles
    let roles = deduplication(ReturnRoles([newMenu]))
    // 清除 菜单 的缓存
    await delMenuRoles(roles)
    res.result(void 0, "恢复菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "恢复菜单失败~", false)
    )
  }
})
export default router
