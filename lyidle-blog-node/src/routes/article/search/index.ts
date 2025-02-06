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
      isBin: 0,
    },
  }
  if (!(id || author || title || desc || category || tags))
    return res.result(
      void 0,
      "请至少传入author、title、desc、category、tags中的一个参数~",
      false
    )

  // 按照标签查询
  if (tags) {
    // 判断是否合并查询
    if (!merge) {
      commend.where = literal(`JSON_CONTAINS(tags, '"${tags}"')`)
    } else {
      commend.where.tags = literal(`JSON_CONTAINS(tags, '"${tags}"')`)
    }
  }

  // 按照种类查询
  if (category) {
    if (!merge) {
      commend.where = { category }
    } else {
      commend.where.category = category
    }
  }

  // 按照描述查询
  if (desc) {
    if (exact)
      if (!merge) {
        commend.where = { desc }
      } else {
        commend.where.desc = desc
      }
    else if (!merge) {
      commend.where = { desc: { [Op.like]: `%${desc}%` } }
    } else {
      commend.where.desc = { [Op.like]: `%${desc}%` }
    }
  }

  // 按照标题查询
  if (title) {
    if (exact)
      if (!merge) {
        commend.where = { title }
      } else {
        commend.where.title = title
      }
    else if (!merge) {
      commend.where = { title: { [Op.like]: `%${title}%` } }
    } else {
      commend.where.title = { [Op.like]: `%${title}%` }
    }
  }

  // 按照作者查询
  if (author) {
    if (exact)
      if (!merge) {
        commend.where = { author }
      } else {
        commend.where.author = author
      }
    else if (!merge) {
      commend.where = { author: { [Op.like]: `%${author}%` } }
    } else {
      commend.where.author = { [Op.like]: `%${author}%` }
    }
  }

  // 按照 id 查询
  if (id) {
    if (!merge) {
      commend.where = { id }
    } else {
      commend.where.id = id
    }
  }

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
/* 
desc
title
author
*/

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
