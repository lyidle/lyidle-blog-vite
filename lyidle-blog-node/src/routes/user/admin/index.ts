import express from "express"
// 引入 api
import deleted from "@/routes/user/admin/delete"
import update from "@/routes/user/admin/update"
import create from "@/routes/user/admin/create"
import setRoles from "@/routes/user/admin/setRoles"
import restore from "./restore"
const router = express.Router()
// 挂载api
router.use("/setRoles", setRoles)
router.use("/update", update)
router.use("/create", create)
router.use("/restore", restore)
router.use("/", deleted)
export default router
