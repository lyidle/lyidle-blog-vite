import express from "express"
// 引入 jwt
import { jwtMiddleware } from "@/middleware/auth"
// 引入 api
import add from "./add"
import get from "./get"
import _update from "./update"
import _delete from "./delete"
const router = express.Router()
// 挂载 api
router.use("/", get)
router.use("/", jwtMiddleware, add)
router.use("/update", jwtMiddleware, _update)
router.use("/delete", jwtMiddleware, _delete)
export default router
