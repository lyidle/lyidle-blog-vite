import { getKey, setKey } from "@/utils/redis"
import { Router } from "express"
// 引入 uuidV4  生成临时文件的 id
import { v4 as uuidV4 } from "uuid"
// 引入模型
const { Visitor } = require("@/db/models")
const router = Router()

router.get("/", async (req, res, next) => {
  // 从请求头中获取 token
  const token = req.headers["authorization"]?.split(" ")[1]
  // 排除用户
  if (token) return res.result(void 0, "")
  // 生成 id
  const id = uuidV4()
  try {
    await Visitor.create({ name: id })
    // 获取到访客数量
    let touristCounts = +(await getKey("touristCounts"))
    // 访客数量 + 1
    await setKey("touristCounts", touristCounts + 1)
    return res.result(void 0, "访客登记成功~")
  } catch (err: any) {
    return res.result(void 0, "访客登记失败~")
  }
})
router.delete("/", async (req, res, next) => {
  const { name } = req.body
  try {
    const result = await Visitor.findOne({ where: { name } })
    // 有值 去掉对应的标识
    if (!result) return res.result(void 0, "访客注销失败~")
    result.destroy()

    // 获取到访客数量
    let touristCounts = +(await getKey("touristCounts"))
    // 自减
    --touristCounts
    // 访客数量 + 1

    await setKey("touristCounts", touristCounts || 0)
    return res.result(void 0, "访客注销成功~")
  } catch (err: any) {
    return res.result(void 0, "访客注销失败~")
  }
})
export default router
