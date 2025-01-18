// node 进行文件相关操作
import { resolve, relative } from "path"
import { readdirSync, statSync } from "fs"

// scss全局变量的配置
export default (
  dirPath: string,
  alias: string = "@/styles/variable"
): string => {
  /**
   * 递归获取目录中所有 .scss 文件的路径。
   * @param directory - 需要搜索的目录路径。
   * @returns 所有 .scss 文件的绝对路径数组。
   */
  function getAllScssFiles(directory: string): string[] {
    let scssFiles: string[] = []
    const files = readdirSync(directory)
    files.forEach((file) => {
      const filePath = resolve(directory, file)
      const stat = statSync(filePath)
      if (stat.isDirectory()) {
        // 如果是目录，递归获取子目录中的 .scss 文件
        scssFiles = scssFiles.concat(getAllScssFiles(filePath))
      } else if (file.endsWith(".scss")) {
        // 如果是 .scss 文件，添加到结果数组
        scssFiles.push(filePath)
      }
    })

    return scssFiles
  }
  // 获取所有 .scss 文件
  const scssFiles = getAllScssFiles(dirPath)
  const result =
    scssFiles
      .map((file) => {
        // 将文件路径转换为 alias 格式
        const relativePath = relative(dirPath, file).replace(/\\/g, "/")
        return `@use "${alias}/${relativePath}" as *;`
      })
      .join("\n") +
    `
  @use "@/styles/mixins.scss" as *;
  @use "@/styles/animations.scss" as *;
`

  // 生成 import 语句
  return result
}
