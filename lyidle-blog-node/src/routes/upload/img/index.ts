import express from "express"
// 引入 上传 临时 图片的api
import temp from "./temp"
// 临时转 永久的 api 文章内容专用
import mdToLinkPermanent from "./mdToLinkPermanent"
// 临时转永久 给定地址 api
import tempImgToPermanet from "./tempImgToPermanet"

const router = express.Router()
router.use("/temp", temp)
router.use("/mdToLinkPermanent", mdToLinkPermanent)
router.use("/tempImgToPermanet", tempImgToPermanet)
export default router
