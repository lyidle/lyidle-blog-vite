import express from "express"
// 引入 permissionGroup
// 获取
import getMenuList from "./get"
// 设置
import setMenuList from "./set"
// 更新
import putMenuList from "./put"
// 删除
import deleteMenuList from "./delete"
// 引入 permission
import permission from "./permission"
const router = express.Router()
router.use(getMenuList)
router.use(setMenuList)
router.use(putMenuList)
router.use(deleteMenuList)
router.use("/permission", permission)
export default router
