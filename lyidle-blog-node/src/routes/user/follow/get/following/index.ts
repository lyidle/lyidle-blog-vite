import express from "express"

const router = express.Router()

// 引入 模型
const { User, Follow } = require("@/db/models")

// 获取 粉丝列表
router.get("/", async (req, res, next) => {
  try {
    const { query } = req
    let { userId, total }: any = query
    if (!userId)
      return res.result(void 0, "获取粉丝列表失败,userId是必传项", false)

    userId = parseInt(userId as string)
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    // 首先获取用户
    const user = await User.findByPk(userId, {
      attributes: ["id"],
    })

    if (!user) {
      return res.result(void 0, "用户不存在", false)
    }

    total = parseInt(total)
    if (typeof total !== "number")
      // 获取粉丝总数
      total = await user.countFollowers({ paranoid: false })

    // 获取分页后的粉丝列表
    const followers = await user.getFollowers({
      attributes: ["id", "nickName", "avatar", "account", "signer"],
      limit: pageSize,
      offset: offset,
      paranoid: false,
      joinTableAttributes: [], // 不返回中间表字段
    })

    res.result(
      {
        pagination: {
          currentPage,
          pageSize,
          total,
        },
        users: followers,
      },
      "获取粉丝列表成功"
    )
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取粉丝列表失败", false)
    )
  }
})

// 获取粉丝 数量
router.get("/counts/:userId", async (req, res, next) => {
  try {
    let userId = req.params.userId

    const counts = await Follow.count({
      where: { followingId: userId },
    })

    res.result(counts, "获取粉丝数量成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取粉丝数量失败", false)
    )
  }
})

export default router
