import express from "express"
import { literal } from "sequelize"
// 设置redis 缓存
import { getKey, setKey } from "@/utils/redis"
const { Menu, MenuList } = require("@/db/models")
const router = express.Router()
router.get("/", async (req, res, next) => {
  // 有缓存直接返回
  const cacheValue = await getKey(`menuList`)
  if (cacheValue) return res.result(cacheValue, "获取菜单成功~")
  try {
    const result = await Menu.findAll({
      where: { isBin: 0, role: literal(`JSON_CONTAINS(role, '"user"')`) },
      include: [
        {
          model: MenuList, // 包括 Article 模型
          as: "children",
          attributes: {
            exclude: ["createdAt", "updatedAt", "MenuId"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "isBin", "role"],
      },
    })
    // if (JSON.stringify(result) === "[]")
    //   return res.result(void 0, "获取菜单失败~", false)
    // 没缓存设置
    await setKey("menuList", result)
    return res.result(result, "获取菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取菜单失败~", false)
    )
  }
})
export default router
