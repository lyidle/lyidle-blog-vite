import express from "express"
// 引入 api
import get from "./get"
import _delete from "./delete"

const router = express.Router()
// 挂载 api
router.use("/get", get)
router.use("/del", _delete)
export default router
