import express from "express"
// 引入搜素函数
import search from "./search"
const router = express.Router()

// 模糊搜索
router.get("/", async (req, res, next) => {
  try {
    await search(req.query, req, res)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询用户信息失败~", false)
    )
  }
})
/* 
  精确搜索 
  nickName
  account
*/
router.get("/exact", async (req, res, next) => {
  try {
    await search(req.query, req, res, true)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询用户信息失败~", false)
    )
  }
})
export default router
