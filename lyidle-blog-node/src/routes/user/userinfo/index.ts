import express from "express"
const router = express.Router()
// 导入模型
const { UserInfo, User } = require("@/db/models")
// 获取当前token用户信息
router.get("/", async (req, res) => {
  // 处理基础信息
  const userInfo: typeof req.auth = JSON.parse(JSON.stringify(req.auth))
  delete userInfo.iat
  delete userInfo.exp
  delete userInfo.email
  // 查询用户信息 统计个数
  const findUser = await User.findOne({
    where: { id: userInfo.id },
    attributes: {
      exclude: ["pwd"],
    },
    include: [
      {
        model: UserInfo,
        attributes: {
          exclude: ["UserId", "userId"],
        },
      },
    ],
  })
  findUser.dataValues.tags
  return res.result(findUser, "获取用户信息成功~")
})
export default router
