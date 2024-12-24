import express from "express"
const router = express.Router()
// 导入模型
const { UserInfo, User } = require("@/db/models")
// 获取当前token用户信息
router.get("/", async (req, res, next) => {
  try {
    // 处理基础信息
    const { id } = JSON.parse(JSON.stringify(req.auth))
    // 查询用户信息 统计个数
    const findUser = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["pwd", "status"],
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
    return res.result(findUser, "获取用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取用户信息失败~", false)
    )
  }
})
export default router
