import express from "express"
import axios from "axios"
// 引入redis 设置缓存
import { getKey, setKey } from "@/utils/redis"
const ms = require("ms")
const default_expire = ms(process.env.default_expire)
const router = express.Router()
router.get("/", async (req, res, next) => {
  try {
    const cacheValue = await getKey("poetry")
    // 如果有缓存直接返回
    if (cacheValue) {
      const { content, author } = cacheValue
      return res.result({ content, author }, "获取古诗词成功~")
    }
    const { data } = await axios.get("https://v1.jinrishici.com/tianqi")
    const { content, author } = data
    // 设置缓存
    await setKey("poetry", data, default_expire)
    return res.result({ content, author }, "获取古诗词成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取古诗词失败~", false)
    )
  }
})
export default router
