import express, { Request, Response, NextFunction } from "express"
import axios from "axios"
import { join, resolve } from "path"
import { existsSync, writeFileSync } from "fs"
// 引入 判断 是否存在路径 不存在则创建
import { isDir } from "@/utils/io/isDir"
// 引入 uuidV4  生成临时文件的 id
import { v4 as uuidV4 } from "uuid"
// 缓存
import { getKey, setKey } from "@/utils/redis"

const router = express.Router()

// api 的前缀
let api_prefix = process.env.api_prefix || "/api"

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  let { url: $url }: { url: string } = req.body
  const { account } = req.auth
  // 先 全部斜杆 转成 /
  api_prefix = api_prefix.replace(/[\\/]/g, "/")
  const url = $url.replace(/[\\/]/g, "/")

  // 检查是否提供了 URL
  if (!url) {
    return res.result(void 0, "请提供有效的 URL", false)
  }

  // 读取缓存
  let cacheValue = await getKey(`upload:img:temp:${account}:${url}`)
  // 有缓存 且文件还存在 则直接返回
  if (cacheValue) {
    // 先 全部斜杆 转成 /
    cacheValue = cacheValue.replace(/[\\/]/g, "/")
    const oldTempImg = join(
      resolve(__dirname, "../../../../"),
      cacheValue.replace(api_prefix, "")
    )
    const isExist = existsSync(oldTempImg)
    if (isExist)
      return res.result({ url: cacheValue, origin: $url }, "上传文件成功~")
  }

  try {
    // 简单判断是否是一个url
    new URL(url)
    // 判断 是否是本地的
    const handlerUrl = url.replace(api_prefix, "")
    // 是临时的图片 且是当前用户 直接返回临时的 防止重复
    if (
      handlerUrl.includes(account) &&
      handlerUrl.startsWith(`/assets/images/temp/${account}`)
    ) {
      const oldTempImg = join(resolve(__dirname, "../../../../"), handlerUrl)
      const isExist = existsSync(oldTempImg)
      // 判断文件是否存在
      if (isExist)
        return res.result(
          { url: join(`${api_prefix}`, handlerUrl), origin: $url },
          "上传文件成功~"
        )
    }
  } catch (error) {
    return res.result(void 0, "请提供有效的 URL", false)
  }

  try {
    // 使用 axios 请求图片
    const response = await axios.get(url, { responseType: "arraybuffer" })
    const buffer: Buffer = Buffer.from(response.data, "binary")

    // 获取图片的 MIME 类型和扩展名
    const contentType: string = response.headers["content-type"]
    const isImage = contentType && contentType.startsWith("image/")

    // 不是图片
    if (!isImage) return res.result(void 0, "上传的不是一个图片", false)

    // 扩展名字
    const extension = contentType.replace("image/", "")

    // 保存的目录
    const savePath = resolve(
      __dirname,
      `../../../../assets/images/temp/${account}/${uuidV4()}.${extension}`
    )

    // 确保路径文件存在
    isDir([savePath])

    // 写入文件
    writeFileSync(savePath, buffer)

    // 求出静态文件的位置信息 加上 api
    const staticPath = join(
      api_prefix,
      savePath.replace(resolve(__dirname, "../../../../"), "")
    )

    // 设置缓存信息 关键点是 传入的url 防止重复生成
    await setKey(`upload:img:temp:${account}:${url}`, staticPath)

    res.result({ url: staticPath, origin: $url }, "上传文件成功~")
  } catch (error) {
    console.error("上传图片时出错:", error)
    res.result(void 0, "上传图片时失败~", false)
  }
})

export default router
