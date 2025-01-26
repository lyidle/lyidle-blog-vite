import { exec } from "child_process"
// 引入 nanoid  生成临时文件的 id
import { nanoid } from "nanoid"
// 引入 判断路径是否 存在 不存在则创建的函数
import { isDir } from "@/utils/io/isDir"
import { existsSync, unlinkSync, writeFileSync } from "fs"
import { join } from "path"
// windows  的 gifsicle 的位置
const win_softWare = process.env.gifsicle_route_window
// 压缩 gif 图片
export const compressGifAndSaveImage = async (
  buffer: Buffer,
  route: string,
  optimize: NumberRange<1, 3> = 2
): Promise<string> => {
  // 生成唯一的文件名
  const uniqueInputFileName = `${nanoid()}.gif`
  const uniqueOutputFileName = `${nanoid()}.gif`

  // 临时文件路径
  const tempInputPath = join(route, uniqueInputFileName)
  // 输出目录
  const outputPath = join(route, uniqueOutputFileName)

  // 确保目录存在
  isDir([tempInputPath, outputPath])

  // 写入临时文件
  writeFileSync(tempInputPath, buffer)

  // 清理临时文件的函数
  const cleanupTempFiles = () => {
    if (existsSync(tempInputPath)) unlinkSync(tempInputPath)
    // 输出的文件等草稿箱上传或删除时再清除
  }

  return new Promise((resolve, reject) => {
    // 使用 exec 调用 gifsicle 压缩 GIF
    const gifsicleCommand =
      process.platform === "win32" ? win_softWare : "gifsicle"

    exec(
      `${gifsicleCommand} --optimize=${optimize} --colors=256 ${tempInputPath} -o ${outputPath}`,
      (err: any, stdout: any, stderr: any) => {
        if (err) {
          reject(new Error(`GIF 压缩失败：${stderr || err.message}`))
          // 清理临时文件（在错误发生后仍然清理）
          cleanupTempFiles()
          return
        }
        // 检查输出文件是否存在
        if (existsSync(outputPath)) {
          resolve(outputPath) //返回保存的路径
        } else {
          reject(new Error("压缩失败：未生成输出文件~"))
        }
        // 清理临时文件
        cleanupTempFiles()
      }
    )
  })
}
