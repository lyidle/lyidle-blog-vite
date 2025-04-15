import express from "express"
// 引入 api
import get from "./get"
const router = express.Router()
// 挂载 api
router.use("/get", get)
export default router
