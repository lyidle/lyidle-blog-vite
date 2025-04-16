import express from "express"
// 引入 api
import get from "./get"
import del from "./del"
const router = express.Router()
// 挂载 api
router.use("/get", get)
router.use("/del", del)
export default router
