import express from "express"
// 引入 api
import allTypes from "./allTypes"
import pagination from "./pagination"
const router = express.Router()
// 挂载 api
router.use("/allTypes", allTypes)
router.use("/pagination", pagination)
export default router
