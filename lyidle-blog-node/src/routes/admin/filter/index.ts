import express from "express"
// 引入 api
import get from "./get"
import add from "./add"
import del from "./del"
import group from "./group"
const router = express.Router()
// 挂载 api
router.use("/get", get)
router.use("/add", add)
router.use("/del", del)
router.use("/group", group)
export default router
