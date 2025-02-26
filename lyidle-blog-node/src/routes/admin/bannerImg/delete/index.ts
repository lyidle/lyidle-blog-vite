import express from "express"
// 引入api
import articleClear from "./clear"
import articleBin from "./bin"
const router = express.Router()
// 挂载api
router.use("/clear", articleClear)
router.use("/bin", articleBin)
export default router
