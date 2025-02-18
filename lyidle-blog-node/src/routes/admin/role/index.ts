import express from "express"
// 引入 role
// 获取
import getRole from "./get"
// 创建
import createRole from "./create"
// 更新
import putRole from "./put"
// 删除
import deleteRole from "./delete"
import setGroups from "./setGroups"
const router = express.Router()
router.use(getRole)
router.use(createRole)
router.use(putRole)
router.use(deleteRole)
router.use("/setGroups", setGroups)
export default router
