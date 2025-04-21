import express from "express"
// 引入 api
import getOneArticle from "./getOneArticle"
import pagination from "./pagination"
import authorAndId from "./authorAndId"
import collect from "./collect"

const router = express.Router()

// 挂载
router.use("/id", getOneArticle)
router.use("/pagination", pagination)
router.use("/authorAndId", authorAndId)
router.use("/collect", collect)
export default router
