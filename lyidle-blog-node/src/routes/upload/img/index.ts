import express from "express"
// 引入 上传 临时 图片的api
import temp from "./temp"
import mdToLinkPermanent from "./mdToLinkPermanent"
const router = express.Router()
router.use("/temp", temp)
router.use("/mdToLinkPermanent", mdToLinkPermanent)
export default router
