import express from "express"
// 引入 permission
// 获取
import getPermission from "./get"
// 设置
import setPermission from "./set"
// 更新
import putPermission from "./put"
// 删除
import deletePermission from "./delete"
const router = express.Router()
router.use(getPermission)
router.use(setPermission)
router.use(putPermission)
router.use(deletePermission)
export default router
