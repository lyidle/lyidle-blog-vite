import express from "express"
// 引入 对应api
import update from "./update"
const router = express.Router()
router.use("/update", update)
export default router
