import express from "express"
// 引入 api
import reply from "./reply"
import likes from "./likes"

const router = express.Router()
// 挂载路由
router.use("/reply", reply)
router.use("/likes", likes)
export default router
