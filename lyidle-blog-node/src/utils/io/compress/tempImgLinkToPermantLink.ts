import { extname, join, resolve } from "path"
import { existsSync, readFileSync, unlinkSync } from "fs"

// gifsicle 压缩
import { compressGifAndSaveImage } from "@/utils/io/compress/compressGifAndSaveImage"
// sharp 压缩
import { compressAndSaveImage } from "@/utils/io/compress/compressAndSaveImage"

// 用于 获取contentType
const { lookup } = require("mime-types")
// 引入 redis 设置缓存
import { setKey, getKey } from "@/utils/redis"
// api 的前缀
const api_prefix = process.env.api_prefix || "/api"

// 判断是否是 GIF
const isGif = (extension: string): boolean => {
  return extension.toLowerCase().includes("gif")
}

// 压缩质量参数
const sharpQuality: NumberRange<1, 100> = 50
const gifsicleQuality: NumberRange<1, 3> = 3
/* 
临时图片的api
生成的文件路径
今天资源路径
账户
*/
type successType = { url: string; origin: string }[]
export const tempImgLinkToPermantLink = async (
  tempImg: string[],
  outputRelative: string,
  $staticPath: string
): Promise<{ tempImgNull: string[]; successImg: successType }> => {
  // 临时的图片 不存在的数组
  const tempImgNull: string[] = []
  // 处理成功后的api 当有临时图片不存在 则前端需要替换掉成功的
  const successImg: successType = []
  // 判断有无 tempImg 需要替换成 永久的 文件链接
  if (Array.isArray(tempImg) && tempImg.length) {
    for (const item of tempImg) {
      // 非空判断
      if (!item) continue
      // 获取到对应的临时目录
      const staticPath = join($staticPath, item.replace("\\api", ""))
      const isExist = existsSync(staticPath)
      // 判断是否存在
      if (isExist) {
        // 存在的读取文件 并处理
        const file = readFileSync(staticPath)
        const extension = extname(staticPath)
        let resolvePath
        // 判断是否是gif
        if (isGif(extension)) {
          // gif 用 gifsicle
          resolvePath = await compressGifAndSaveImage(
            file,
            outputRelative,
            gifsicleQuality
          )
          // 需要是一个图片
        } else if (lookup(staticPath).startsWith("image/")) {
          // 其他格式使用 sharp 压缩
          resolvePath = await compressAndSaveImage(
            file,
            outputRelative,
            sharpQuality
          )
        }
        // 存在 添加到 数组
        if (resolvePath) {
          // 去掉 assets之前的路径生成api
          const api = resolvePath.replace($staticPath, "")
          const result = { url: join(api_prefix, api), origin: item }

          // 删除 临时文件
          unlinkSync(staticPath)

          successImg.push(result)
        }
        continue
      }
      // 不存在 添加到 数组
      tempImgNull.push(api_prefix + item)
    }
  }
  return { tempImgNull, successImg }
}
