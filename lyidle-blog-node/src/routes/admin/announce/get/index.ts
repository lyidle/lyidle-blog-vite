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
    // 获取真实客户端 IP
    /** 需要 配置 OpenResty/Nginx 传递真实 IP
     * proxy_set_header X-Real-IP $remote_addr;
     * proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     */
    const userIp: string =
      ((req.headers["x-forwarded-for"] as string)?.split(",")[0] as string) ||
      (req.headers["x-real-ip"] as string) ||
      (req.connection.remoteAddress as string)
    type ipRegionType =
      | Omit<IP2RegionResult, "isp"> & {
          isp?: string
          userIp?: string
        }

    // 有缓存直接返回
    let ipRegion: ipRegionType | null = null
    // 是本地的跳过

    const query = new IP2Region()
    const testIP = "120.24.78.68"
    let data
    // 是否 是模拟的 数据
    if (!is_production) data = query.search(testIP) as IP2RegionResult
    // 开发环境 需要 不是本地的
    else if (!ip.isPrivate(userIp))
      data = query.search(userIp) as IP2RegionResult
    if (data) {
      const { country, province, city } = data
      ipRegion = { country, province, city }
      ;(ipRegion as ipRegionType).userIp = userIp
      if (!is_production) (ipRegion as ipRegionType).userIp = testIP
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
    const findSetting = await Setting.findOne({
      where: { name: "公告" },
    })

    if (!findSetting && !ipRegion)
      return res.result(void 0, "获取公告失败~", false)

    if (findSetting?.dataValues)
      await setKey(`setting:公告`, findSetting?.dataValues)

    return res.result(
      {
        announce: findSetting?.dataValues,
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
