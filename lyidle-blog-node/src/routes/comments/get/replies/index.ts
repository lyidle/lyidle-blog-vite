import express from "express"
// 引入 api
import pagination from "./pagination"
const router = express.Router()

router.use("/", pagination)

export default router
