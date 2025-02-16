import express from "express"
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
router.use(getMenuList)
router.use(createMenuList)
router.use(putMenuList)
router.use(deleteMenuList)
export default router
