import express from "express"
// 引入 /admin/bannerImg
// 获取
import getBannerImg from "./get"
// 更新
import putBannerImg from "./put"
const router = express.Router()
router.use(getBannerImg)
router.use(putBannerImg)
export default router
