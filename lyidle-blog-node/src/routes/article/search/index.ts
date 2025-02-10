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
  isBin: boolean = false
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
    attributes: [
      "id",
      "author",
      "title",
      "desc",
      "category",
      "tags",
      "userId",
      "poster",
      "createdAt",
      "updatedAt",
    ],
    limit: pageSize,
    offset,
    where: {
      isBin: "",
    },
  }
  if (!(id || author || title || desc || category || tags))
    return res.result(
      void 0,
      "请至少传入id、author、title、desc、category、tags中的一个参数~",
      false
    )

  const addCondition = (key: string, value: string, isExact = false) => {
    if (!merge) {
      commend.where = { [key]: isExact ? value : { [Op.like]: `%${value}%` } }
    } else {
      commend.where[key] = isExact ? value : { [Op.like]: `%${value}%` }
    }
  }

  if (tags) {
    const condition = literal(`JSON_CONTAINS(tags, '"${tags}"')`)
    !merge ? (commend.where = condition) : (commend.where.tags = condition)
  }

  if (category) addCondition("category", category, true)
  if (desc) addCondition("desc", desc, exact)
  if (title) addCondition("title", title, exact)
  if (author) addCondition("author", author, exact)
  if (id) addCondition("id", id, true)

  // 判断是否 查询回收站
  if (isBin) commend.where.isBin = 1

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
