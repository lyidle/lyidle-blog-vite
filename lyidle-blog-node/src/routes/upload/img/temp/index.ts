import express, { Request, Response, NextFunction } from "express"
import axios from "axios"
import { join, basename } from "path"
import { existsSync } from "fs"

// 引入 对应的压缩
// gifsicle 处理gif
import { compressGifAndSaveImage } from "@/utils/io/compress/compressGifAndSaveImage"
// sharp 处理 其他图片
import { compressAndSaveImage } from "@/utils/io/compress/compressAndSaveImage"

// 缓存
const { getKey, setKey } = require("@/utils/redis")
const router = express.Router()

// 压缩质量参数
const sharpQuality: NumberRange<1, 100> = 50
const gifsicleQuality: NumberRange<1, 3> = 3

// 生成的文件 相对于什么路径
const outputRelative = join(__dirname, "../../../../images/temp")

// 判断是否是 GIF
const isGif = (extension: string): boolean => {
  const isGifType = extension.toLowerCase().includes("gif")
  return isGifType
}

// api 的前缀
const api_prefix = process.env.api_prefix || "/api"
// 临时文件 api 的前缀 后面跟上作者
const temp_md_api = join(api_prefix, "/img/temp")

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { url }: { url: string } = req.body

  // 检查是否提供了 URL
  if (!url) {
    return res.result(void 0, "请提供有效的 URL", false)
  }

  // 简单判断是否是一个url
  try {
    new URL(url)
  } catch (error) {
    return res.result(void 0, "请提供有效的 URL", false)
  }

  const { account } = req.auth

  const cacheValue = await getKey(`img:docs:temp:${account}:${basename(url)}`)

  if (cacheValue) {
    // 得到文件和文件目录
    const cacheBaseName = basename(cacheValue)
    const cacheRoute = join(outputRelative, account, cacheBaseName)

    // 判断缓存的文件 是否存在
    const file = await existsSync(cacheRoute)

    // 存在返回结果
    if (file)
      return res.result({ url: cacheValue, origin: url }, "成功转换并压缩图片~")
    // 不存在 则 处理图片
  }

  // 输出 临时 的数据位置
  const outputRoute = join(outputRelative, account)

  try {
    // 使用 axios 请求图片
    const response = await axios.get(url, { responseType: "arraybuffer" })
    const buffer: Buffer = Buffer.from(response.data, "binary")

    // 获取图片的 MIME 类型和扩展名
    const contentType: string = response.headers["content-type"]
    const isImage = contentType && contentType.startsWith("image/")
    // 存储 最终 处理的图片 路径
    let absolutePath: string = ""

    if (isGif(contentType)) {
      // gif 用 gifsicle
      absolutePath = await compressGifAndSaveImage(
        buffer,
        outputRoute,
        gifsicleQuality
      )
    } else if (isImage) {
      // 其他格式使用 sharp 压缩
      absolutePath = await compressAndSaveImage(
        buffer,
        outputRoute,
        sharpQuality
      )
    }

    // 判断是否是图片且 有无 路径生成
    if (isGif(contentType) || (isImage && absolutePath)) {
      const result = basename(absolutePath)
      // 获取md临时图片的 api 信息 的接口
      const temp_md_url = join(temp_md_api, account, result)

      // 缓存 结果信息
      await setKey(`img:docs:temp:${account}:${basename(url)}`, temp_md_url)

      // 返回结果
      return res.result(
        { url: temp_md_url, origin: url },
        "成功转换并压缩图片~"
      )
    }

    return res.result({ url: url, origin: url }, "转换图片失败~", false)
  } catch (error) {
    console.error("转换或压缩图片时出错:", error)
    res.result({ url: url, origin: url }, "转换图片失败~", false)
  }
})

export default router
