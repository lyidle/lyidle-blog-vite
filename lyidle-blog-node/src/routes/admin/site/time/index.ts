import express from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 api
import get from "./pagination"
import add from "./add"
import put from "./put"
import del from "./del"
const router = express.Router()
// 挂载 api
router.use("/get", get)
router.use("/add", [jwtMiddleware, isAdmin], add)
router.use("/put", [jwtMiddleware, isAdmin], put)
router.use("/del", [jwtMiddleware, isAdmin], del)
export default router
