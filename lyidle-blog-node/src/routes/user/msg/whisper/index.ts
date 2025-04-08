import express from "express"
// 引入 api
import get from "./get"
import send from "./send"
import mark from "./mark"

const router = express.Router()
// 挂载路由
router.use("/get", get)
router.use("/send", send)
router.use("/mark", mark)
export default router
