import express from "express"
// 导入 api/announce
import getAnnounce from "./get"
import setAnnounce from "./set"
const router = express.Router()
router.use(getAnnounce)
router.use(setAnnounce)
export default router
