import express from "express"
import axios from "axios"
const router = express.Router()
router.get("/", async (req, res, next) => {
  try {
    const { data } = await axios.get("https://v1.jinrishici.com/tianqi")
    const { content, author } = data
    res.result({ content, author }, "获取古诗词成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取古诗词失败~", false)
    )
  }
})
export default router
