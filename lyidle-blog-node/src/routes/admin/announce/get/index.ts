import express from "express"
import IP2Region, { IP2RegionResult } from "ip2region"
// 导入 ip 包
const ip = require("ip")
// 引入模型
const { Setting } = require("@/db/models")
const router = express.Router()
router.get("/", async (req, res, next) => {
  try {
    // 获取ip
    const userIp = ip.address()
    type ipRegionType =
      | Omit<IP2RegionResult, "isp"> & {
          isp?: string
          userIp?: string
        }

    let ipRegion: ipRegionType | null = null
    // 是本地的跳过
    if (!ip.isPrivate(userIp)) {
      const query = new IP2Region()
      const data = query.search("120.24.78.68") as IP2RegionResult
      if (data) {
        const { country, province, city } = data
        ipRegion = { country, province, city }
      }
      ;(ipRegion as ipRegionType).userIp = userIp
    }
    const findAnnounce = await Setting.findOne({
      where: { name: "announce" },
      attributes: ["content"],
    })
    const announce = findAnnounce?.dataValues?.content
      ? findAnnounce?.dataValues?.content
      : null
    if (announce === null) return res.result(void 0, "获取公告失败~", false)
    return res.result(
      {
        announce,
        region: ipRegion === null ? null : { ...ipRegion },
      },
      "获取公告成功~"
    )
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "获取公告失败~", false)
    )
  }
})
export default router
