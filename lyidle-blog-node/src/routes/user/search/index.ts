import express from "express"
// 引入搜素函数
import search from "./search"
import { getKey, setKey } from "@/utils/redis"
import { Op } from "sequelize"
// 导入模型
const { User } = require("@/db/models")
const router = express.Router()
// 环境变量
const default_owner = process.env.default_owner!
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

// 按照 按照 id、roles、account 搜索计数
// isBin 判断 是否查询 软删除的
router.get("/user", async (req, res, next) => {
  const { id, account, isBin } = req.query
  let roles = req.query.roles
  if (!id && !roles && !account)
    return res.result(
      void 0,
      "查询用户，至少要传入id、roles、account中的一个参数~",
      false
    )
  if (roles && roles !== default_owner) {
    return res.result(
      void 0,
      "该接口查询用户信息失败,roles只能传入owner~",
      false
    )
  }

  // 缓存 的键
  let cacheKey = `userInfo:${id || roles || account}`

  //  查询回收站 缓存 的键
  if (isBin) cacheKey = `userInfo:bin:${id || roles || account}`

  if (roles) roles = JSON.stringify([roles])

  if (cacheKey) {
    // 缓存用户信息
    const cacheValue = await getKey(cacheKey)
    if (cacheValue) return res.result(cacheValue, "查询用户信息成功~")
  }

  try {
    const findUser = await search(
      { id, roles, account },
      res,
      true,
      true,
      false,
      JSON.parse(isBin as string)
    )
    // 不存在
    if (!findUser) return
    // 存储用户信息 到 redis
    if (cacheKey) await setKey(cacheKey, findUser)
    return res.result(findUser, "查询用户信息成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result({ msg: req.query }, "查询用户信息失败~", false)
    )
  }
})

router.get("/findByPk/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await User.findByPk(id, {
      paranoid: false,
      attributes: { exclude: ["pwd"] },
    })
    if (!user) return res.result(void 0, "查询用户失败", false)
    res.result(user, "查询用户成功")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询用户失败", false)
    )
  }
})

router.get("/findByAccount", async (req, res, next) => {
  try {
    const {
      keyword,
      currentPage = 1,
      pageSize = 10,
    }: {
      keyword: string
      currentPage: number
      pageSize: number
    } = req.query as any

    const { count, rows } = await User.findAndCountAll({
      where: keyword
        ? {
            account: {
              [Op.like]: `%${keyword}%`, // 模糊匹配
            },
          }
        : undefined,
      attributes: { exclude: ["pwd"] }, // 排除密码字段
      offset: (currentPage - 1) * pageSize, // 分页偏移量
      limit: Number(pageSize), // 每页数量
    })

    res.result(
      {
        pagination: {
          total: count,
          currentPage,
          pageSize,
        },
        users: rows,
      },
      "搜索成功"
    )
  } catch (error) {
    res.validateAuth(error, next, () => res.result(void 0, "搜索失败", false))
  }
})
export default router
