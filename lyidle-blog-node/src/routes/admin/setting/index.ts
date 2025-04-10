import express from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 api/initial/settings
import getSettings from "./get"
import setSettings from "./set"
import updateSettings from "./update"
import deleteSettings from "./delete"
const router = express.Router()
router.use("/", getSettings)
router.use("/", [jwtMiddleware, isAdmin], setSettings)
router.use("/", [jwtMiddleware, isAdmin], updateSettings)
router.use("/", [jwtMiddleware, isAdmin], deleteSettings)
// 挂载路由
export default router
