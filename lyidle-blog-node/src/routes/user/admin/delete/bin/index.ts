import express from "express"
import remove from "@/routes/user/admin/delete/remove"
const router = express.Router()
// 彻底删除
router.delete("/", async (req, res) => {
  await remove(req, res, true)
})
export default router
