import express from "express"
import { Op, literal } from "sequelize"
const router = express.Router()
// 导入模型
const { Article } = require("@/db/models")
const search = async (
  req: any,
  res: any,
  exact?: boolean,
  isBin: boolean = false
) => {
  const { id, author, title, desc, category, tags } = req.query
  const commend: any = {
    attributes: ["id", "author", "title", "desc", "category", "tags"],
  }
  if (!(id || author || title || desc || category || tags))
    return res.result(
      void 0,
      "请至少传入author、title、desc、category、tags中的一个参数~",
      false,
      400
    )
  // 按照标签查询
  if (tags) {
    commend.where = literal(`JSON_CONTAINS(tags, '"${tags}"')`)
  }
  // 按照种类查询
  if (category)
    commend.where = {
      category,
    }
  // 按照描述查询
  if (desc)
    commend.where = {
      desc: { [Op.like]: `%${desc}%` },
    }
  // 按照描述精确查询
  if (desc && exact) {
    commend.where = {
      desc: desc,
    }
  }
  // 按照标题查询
  if (title)
    commend.where = {
      title: { [Op.like]: `%${title}%` },
    }
  // 按照标题精确查询
  if (title && exact)
    commend.where = {
      title: title,
    }
  // 按照作者查询
  if (author)
    commend.where = {
      author: { [Op.like]: `%${author}%` },
    }
  // 按照作者精确查询
  if (author && exact)
    commend.where = {
      author: author,
    }
  // 按照id查询
  if (id) {
    commend.where = {
      id,
    }
  }
  if (!isBin) commend.where.isBin = 0
  // 查询用户的所有文章
  const result = await Article.findAll(commend)
  if (JSON.stringify(result) === "[]")
    return res.result(void 0, "查询文章失败~", false)
  return res.result(result, "查询文章成功~")
}
// 查询文章 模糊
router.get("/", async (req, res) => {
  await search(req, res)
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
export default router
