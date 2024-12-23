import { NextFunction, Request } from "express"
// 用于制作唯一标识
const DeviceDetector = require("device-detector-js")
const ip = require("ip")
// 引入模型
const { Visitor } = require("@/db/models")
export default async (req: Request, next: NextFunction) => {
  // 从请求头中获取 token
  const token = req.headers["authorization"]?.split(" ")[1]
  // 排除用户
  if (token) return
  // 获取ip
  const userIp = ip.address()
  // 是本地的跳过
  if (ip.isPrivate(userIp)) return
  // 获取设置等信息
  const userAgent = req.headers["user-agent"] || ""
  const detector = new DeviceDetector()
  const device = detector.parse(userAgent)
  // 过滤掉没有设备的 apifox等工具
  if (!device.device) return
  // 使用 设备类型、操作系统、浏览器等加ip做访客唯一标识
  const visitPrint = JSON.stringify(device, userIp)
  try {
    return await Visitor.create({ name: visitPrint })
  } catch (err: any) {
    if (err.name !== "SequelizeValidationError") next(err)
  }
}
