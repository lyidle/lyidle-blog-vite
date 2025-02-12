import express from "express"
const { Menu, Role } = require("@/db/models")
const router = express.Router()

// 获取菜单列表
router.get("/", async (req, res, next) => {
  try {
    const menus = await Menu.findAll({
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["name"], // 只获取角色名称
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
          required: false, // 避免用户没有权限时被过滤掉
        },
        {
          model: Menu,
          as: "children",
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["name"], // 只获取角色名称
              through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
              required: false, // 避免用户没有权限时被过滤掉
            },
          ],
        },
      ],
    })

    if (!menus.length) {
      return res.result(void 0, "暂无权限访问任何菜单哦~", false)
    }

    return res.result(menus, "获取菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取菜单失败~", false)
    )
  }
})

export default router
