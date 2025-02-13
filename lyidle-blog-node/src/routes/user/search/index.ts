import express from "express"
// 引入搜素函数
import search from "./search"
import { getKey, setKey } from "@/utils/redis"
const router = express.Router()

// 模糊搜索
router.get("/", async (req, res, next) => {
  try {
    const findUser = await search(req.query, res)
    // 不存在
    if (!findUser) return
    return res.result(findUser, "查询用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result({ msg: req.query }, "查询用户信息失败~", false)
    )
  }
})

/* 
  模糊搜索 
  且计数
*/
router.get("/counts", async (req, res, next) => {
  try {
    const findUser = await search(req.query, res, false, true)
    // 不存在
    if (!findUser) return
    return res.result(findUser, "查询用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result({ msg: req.query }, "查询用户信息失败~", false)
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
    const findUser = await search(req.query, res, true)
    // 不存在
    if (!findUser) return
    return res.result(findUser, "查询用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result({ msg: req.query }, "查询用户信息失败~", false)
    )
  }
})

/* 
  精确搜索 
  nickName
  account
  且计数
*/
router.get("/exact/counts", async (req, res, next) => {
  try {
    const findUser = await search(req.query, res, true, true)
    // 不存在
    if (!findUser) return
    return res.result(findUser, "查询用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result({ msg: req.query }, "查询用户信息失败~", false)
    )
  }
})

// 按照 按照 id、role、account 搜索计数
router.get("/user", async (req, res, next) => {
  const id = req.query.id
  const role = req.query.role
  const account = req.query.account
  if (!id && !role && !account)
    return res.result(
      void 0,
      "查询用户，至少要传入id、role、author中的一个参数~",
      false
    )

  const cacheKey = id || (role === "owner" && role) || account
  if (cacheKey) {
    // 缓存用户信息
    const cacheValue = await getKey(`userInfo:${cacheKey}`)
    if (cacheValue) return res.result(cacheValue, "查询用户信息成功~")
  }

  try {
    const findUser = await search(req.query, res, true, true, false)
    // 不存在
    if (!findUser) return
    // 存储用户信息 到 redis
    if (cacheKey) await setKey(`userInfo:${cacheKey}`, findUser)
    return res.result(findUser, "查询用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result({ msg: req.query }, "查询用户信息失败~", false)
    )
  }
})

export default router
