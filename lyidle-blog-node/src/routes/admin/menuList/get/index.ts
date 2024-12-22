import express from "express"
const { Menu, MenuList } = require("@/db/models")
const router = express.Router()
router.get("/", async (req, res) => {
  const result = await Menu.findAll({
    include: [
      {
        model: MenuList, // 包括 Article 模型
        attributes: {
          exclude: ["createdAt", "updatedAt", "MenuId"],
        },
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
  return res.result(result, "获取菜单成功~")
})
export default router
