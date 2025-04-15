import express from "express"
// 引入 api
import add from "./add"
const router = express.Router()
// 挂载 api
router.use("/add", add)
export default router
