import express from "express"
// 引入 api
import reply from "./reply"
import likes from "./likes"
import at from "./at"
import whisper from "./whisper"
import system from "./system"

const router = express.Router()
// 挂载路由
router.use("/reply", reply)
router.use("/likes", likes)
router.use("/at", at)
router.use("/whisper", whisper)
router.use("/system", system)
export default router
