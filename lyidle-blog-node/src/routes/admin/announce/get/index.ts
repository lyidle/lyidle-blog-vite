import express from "express"
import axios from "axios"
// 导入 ip 包
const ip = require("ip")
// 引入模型
const { Setting } = require("@/db/models")
const router = express.Router()
router.get("/", async (req, res) => {
  // 获取ip
  const userIp = ip.address()
  const ipRegion = {}
  // 是本地的跳过
  if (!ip.isPrivate(userIp)) {
    const { data } = await axios.get(
      `https://www.cz88.net/api/cz88/ip/geo?ip=${userIp}`
    )
    const { country, province, city, districts } = data.data
    Object.assign(ipRegion, { country, province, city, districts, userIp })
  }
  const findAnnounce = await Setting.findOne({
    where: { name: "announce" },
    attributes: ["content"],
  })
  const { content: announce } = findAnnounce.dataValues
  return res.result(
    {
      announce,
      region: JSON.stringify(ipRegion) === "{}" ? null : { ...ipRegion },
    },
    "获取公告成功~"
  )
})
export default router
