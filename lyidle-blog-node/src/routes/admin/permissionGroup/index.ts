import express from "express"
// 引入 permissionGroup
// 获取
import getMenuList from "./get"
// 创建
import createMenuList from "./create"
// 更新
import putMenuList from "./put"
// 删除
import deleteMenuList from "./delete"
import setPermissions from "./setPermissions"
// 引入 permission
import permission from "./permission"
const router = express.Router()
router.use("/", getMenuList)
router.use("/", createMenuList)
router.use("/", putMenuList)
router.use("/", deleteMenuList)
router.use("/setPermissions", setPermissions)
router.use("/permission", permission)
export default router
