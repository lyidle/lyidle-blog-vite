import express from "express"
// 引入 api
import reply from "./reply"
import likes from "./likes"
import at from "./at"

const router = express.Router()
// 挂载路由
router.use("/reply", reply)
router.use("/likes", likes)
router.use("/at", at)
export default router
