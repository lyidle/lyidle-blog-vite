import express from "express"
// 引入 api
import comments from "./comments"
const router = express.Router()
// 挂载 api
router.use("/comments", comments)
export default router
