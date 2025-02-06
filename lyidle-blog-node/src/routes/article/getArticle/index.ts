import express from "express"
// 引入 api
import getOneArticle from "./getOneArticle"
import pagination from "./pagination"
import authorAndId from "./authorAndId"

const router = express.Router()

// 挂载
router.use("/id", getOneArticle)
router.use("/pagination", pagination)
router.use("/authorAndId", authorAndId)
export default router
