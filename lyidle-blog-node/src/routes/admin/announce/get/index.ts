import express from "express"
import IP2Region, { IP2RegionResult } from "ip2region"
// 设置redis 缓存
import { getKey, setKey } from "@/utils/redis"
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

    // 有缓存直接返回
    let ipRegion: ipRegionType | null =
      !is_production && (await getKey(`ipRegion:${userIp}`))
    // 没缓存 设置
    // 是本地的跳过
    if (!ipRegion && (!is_production || !ip.isPrivate(userIp))) {
      const query = new IP2Region()
      let data
      if (!is_production) data = query.search("120.24.78.68") as IP2RegionResult
      else data = query.search(userIp) as IP2RegionResult
      if (data) {
        const { country, province, city } = data
        ipRegion = { country, province, city }
      }
      ;(ipRegion as ipRegionType).userIp = userIp
      await setKey(`ipRegion:${userIp}`, ipRegion)
    }

    // 有缓存直接返回
    const cacheValue = await getKey(`setting:公告`)
    if (cacheValue) {
      return res.result(
        {
          announce: cacheValue,
          region: ipRegion ? { ...ipRegion } : null,
        },
        "获取公告成功~"
      )
    }

    // 没缓存设置
    const { dataValues } = await Setting.findOne({
      where: { name: "公告" },
    })

    await setKey(`setting:公告`, dataValues)
    return res.result(
      {
        announce: dataValues,
        region: ipRegion ? { ...ipRegion } : null,
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
