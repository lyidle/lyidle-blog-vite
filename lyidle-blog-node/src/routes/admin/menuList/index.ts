import express from "express"
// 引入 /admin/menuList
import getMenuList from "./get"
import setMenuList from "./set"
const router = express.Router()
router.use(getMenuList)
router.use(setMenuList)
export default router
