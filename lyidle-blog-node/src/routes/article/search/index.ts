import express from "express"
import { Op, literal } from "sequelize"
const router = express.Router()
// 导入模型
const { Article } = require("@/db/models")
// 搜索回调
const search = async (
  req: any,
  res: any,
  exact: boolean = false,
  merge: boolean = false,
  callBack?: (commend: any) => void
) => {
  const { query } = req
  const { id, author, title, desc, category, tags } = query
  /**
   * @pagesize 每页显示条目个数
   * @currentPage 当前页
   */
  const currentPage = Math.abs(Number(query.currentPage)) || 1
  const pageSize = Math.abs(Number(query.pageSize)) || 10
  const offset = (currentPage - 1) * pageSize

  const commend: any = {
    attributes: { exclude: ["UserId"] },
    limit: pageSize,
    offset,
    order: [["carousel", "desc"], [["id", "desc"]]],
    where: {},
  }

  const addCondition = (key: string, value: string, isExact = false) => {
    if (!merge) {
      commend.where = { [key]: isExact ? value : { [Op.like]: `%${value}%` } }
    } else {
      commend.where[key] = isExact ? value : { [Op.like]: `%${value}%` }
    }
  }

  if (tags && tags.length) {
    const tagsArray = JSON.parse(tags)
      .map((tag: string) => `"${tag}"`)
      .join(",")
    const condition = literal(`JSON_CONTAINS(tags, JSON_ARRAY(${tagsArray}))`)
    !merge ? (commend.where = condition) : (commend.where.tags = condition)
  }

  if (category) addCondition("category", category, true)
  if (desc) addCondition("desc", desc, exact)
  if (title) addCondition("title", title, exact)
  if (author) addCondition("author", author, exact)
  if (id) addCondition("id", id, true)

  // 回调函数
  callBack && callBack(commend)
  // 查询用户的所有文章
  const { count, rows } = await Article.findAndCountAll(commend)

  if (!count) return res.result(void 0, "查询文章失败~", false)

  return res.result(
    {
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
      article: rows,
    },
    "查询文章成功~"
  )
}

/* 精确 和 模糊的区别 精确的一下信息是完全匹配
 * desc
 * title
 * author
 *
 * 不论精确还是模糊 都是精确的是 tags category id
 */

// 查询文章 模糊
router.get("/", async (req, res, next) => {
  try {
    await search(req, res)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询文章失败~", false)
    )
  }
})

// 查询文章 精确

router.get("/exact", async (req, res, next) => {
  try {
    await search(req, res, true)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询文章失败~", false)
    )
  }
})

// 查询文章 模糊 合并
router.get("/merge", async (req, res, next) => {
  try {
    await search(req, res, false, true)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询文章失败~", false)
    )
  }
})

// 查询文章 精确 合并
router.get("/merge/exact", async (req, res, next) => {
  try {
    await search(req, res, true, true)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "查询文章失败~", false)
    )
  }
})

export default router
