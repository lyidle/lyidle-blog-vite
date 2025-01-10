import express from "express"
// 引入 api/initial/settings
import getSettings from "./get"
import setSettings from "./set"
import updateSettings from "./update"
import deleteSettings from "./delete"
const router = express.Router()
router.use(getSettings)
router.use(setSettings)
router.use(updateSettings)
router.use(deleteSettings)
// 挂载路由
export default router
