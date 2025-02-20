import express from "express"
// 引入 api
import all from "./all"
const router = express.Router()
// 挂载 api
router.use("/all", all)
export default router
