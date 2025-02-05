import express from "express"
// 引入 api
import all from "./all"
import one from "./one"
const router = express.Router()
// 挂载 api
router.use("/all", all)
router.use("/one", one)
export default router
