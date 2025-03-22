import express from "express"
// 引入 点赞和点菜的 接口
import like from "./like"
import dislike from "./dislike"
const router = express.Router()
// 挂载接口
router.use("/like", like)
router.use("/dislike", dislike)
export default router
