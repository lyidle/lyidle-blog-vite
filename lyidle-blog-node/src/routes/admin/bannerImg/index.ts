import express from "express"
// 引入 /admin/menuList
// 获取
import getBannerImg from "./get"
// 创建
import createBannerImg from "./create"
// 更新
import putBannerImg from "./put"
// 删除
import deleteBannerImg from "./delete"
const router = express.Router()
router.use(getBannerImg)
router.use(createBannerImg)
router.use(putBannerImg)
router.use(deleteBannerImg)
export default router
