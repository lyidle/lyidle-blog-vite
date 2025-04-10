import express from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// 引入 /admin/menuList
// 获取
import getMenuList from "./get"
// 创建
import createMenuList from "./create"
// 更新
import putMenuList from "./put"
// 删除
import deleteMenuList from "./delete"
const router = express.Router()
router.use("/", getMenuList)
router.use("/", [jwtMiddleware, isAdmin], createMenuList)
router.use("/", [jwtMiddleware, isAdmin], putMenuList)
router.use("/", [jwtMiddleware, isAdmin], deleteMenuList)
export default router
