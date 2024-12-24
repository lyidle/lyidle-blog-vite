import express from "express"
import remove from "@/routes/article/admin/delete/remove"
const router = express.Router()
// 彻底删除
router.delete("/", async (req, res, next) => {
  try {
    await remove(req, res)
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "删除文章失败~", false)
    )
  }
})
export default router
