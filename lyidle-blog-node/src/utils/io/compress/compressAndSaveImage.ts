import sharp from "sharp" // 引入 Sharp 作为图片压缩工具
// 引入 nanoid  生成临时文件的 id
import { nanoid } from "nanoid"
// 引入 判断路径是否 存在 不存在则创建的函数
import { isDir } from "@/utils/io/isDir"
import { join } from "path"
// 不是 gif 的图片
export const compressAndSaveImage = async (
  buffer: Buffer,
  route: string,
  quality: NumberRange<1, 100> = 50
): Promise<string> => {
  // 生成唯一的文件名
  const uniqueOutputFileName = `${nanoid()}.jpeg`
  // 输出目录
  const outputPath = join(route, uniqueOutputFileName)

  // 确保目录存在
  isDir([outputPath])

  return new Promise((resolve, reject) => {
    sharp(buffer)
      .jpeg({ quality })
      .toFile(outputPath, (err, info) => {
        if (err) {
          reject("压缩失败：未生成输出文件~ " + err)
        } else {
          resolve(outputPath) // 返回保存的文件路径
        }
      })
  })
}
