import { Request, Response } from "express"
import { FindOptions } from "sequelize"
const { Article } = require("@/db/models")
export default async (req: Request, res: Response, cb?: Function) => {
  const { id } = req.body
  const commend: FindOptions = {}
  if (!id) return res.result(void 0, "没有找到文章哦~", false)
  // 按照id删除
  commend.where = {
    id: id,
  }
  cb && cb({ commend })
  // 查找是否有文章
  const findArticle = await Article.findOne(commend)
  // 没有找到文章
  if (!findArticle) return res.result(void 0, "没有找到文章哦~", false, 404)
  // 找到返回
  return { findArticle, id }
}
