import express from "express"
const router = express.Router()
// 导入模型
const { UserInfo } = require("@/db/models")
// 获取当前token用户信息
router.get("/", async (req, res) => {
  // 处理基础信息
  const userInfo: typeof req.auth = JSON.parse(JSON.stringify(req.auth))
  delete userInfo.iat
  delete userInfo.exp
  delete userInfo.email
  // 查询用户信息 统计个数
  const findUserInfo = await UserInfo.findOne({
    where: { userId: userInfo.id },
  })
  // 返回的信息
  const result: any = { ...userInfo }
  // 如果找到信息 则代表有
  if (findUserInfo) {
    const { articleCounts, tipArrays, categoryArrays, totalWords } =
      findUserInfo.dataValues
    result.counts = {
      pages: articleCounts,
      tags: tipArrays,
      categories: categoryArrays,
      totalWords,
    }
  }
  // 如果没有找到 则数量全为零
  if (!findUserInfo) {
    result.counts = {
      pages: 0,
      tags: 0,
      categories: 0,
    }
  }
  return res.result(result, "获取用户信息成功~")
})
export default router
