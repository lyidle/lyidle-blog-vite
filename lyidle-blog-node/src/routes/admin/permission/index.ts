import express from "express"
// 引入 /admin/menuList
// 获取
import getMenuList from "./get"
// 设置
import setMenuList from "./set"
// 更新
import putMenuList from "./put"
// 删除
import deleteMenuList from "./delete"
const router = express.Router()
router.use(getMenuList)
router.use(setMenuList)
router.use(putMenuList)
router.use(deleteMenuList)
export default router
