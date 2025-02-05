import express from "express"
const router = express.Router()
router.get("/", (req, res) => {
  res.result(void 0, "获取成功~")
})
export default router
