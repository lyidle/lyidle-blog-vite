import express from "express"
import axios from "axios"
const router = express.Router()
router.get("/", async (req, res) => {
  const { data } = await axios.get("https://v1.jinrishici.com/tianqi")
  const { content, author } = data
  res.result({ content, author }, "获取古诗词成功~")
})
export default router
