import express from "express"
import IP2Region, { IP2RegionResult } from "ip2region"
// 设置redis 缓存
const { getKey, setKey } = require("@/utils/redis")
// 导入 ip 包
const ip = require("ip")
// 引入模型
const { Setting } = require("@/db/models")
// 判断是否是生成环境
const is_production = JSON.parse(process.env.is_production!)

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
    if (!ip.isPrivate(userIp) || !is_production) {
      const query = new IP2Region()
      let data
      if (!is_production) data = query.search("120.24.78.68") as IP2RegionResult
      else data = query.search(userIp) as IP2RegionResult
      if (data) {
        const { country, province, city } = data
        ipRegion = { country, province, city }
      }
      ;(ipRegion as ipRegionType).userIp = userIp
    }
    // 有缓存直接返回
    const cacheValue = await getKey(`announce`)
    if (cacheValue) {
      return res.result(
        {
          cacheValue,
          region: ipRegion === null ? null : { ...ipRegion },
        },
        "获取公告成功~"
      )
    }
    const findAnnounce = await Setting.findOne({
      where: { name: "announce" },
      attributes: ["content"],
    })
    const announce = findAnnounce?.dataValues?.content
      ? findAnnounce?.dataValues?.content
      : null
    if (announce === null) return res.result(void 0, "获取公告失败~", false)
    // 没缓存设置
    await setKey("announce", announce)
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
