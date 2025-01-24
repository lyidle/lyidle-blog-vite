import fs from "fs"
import path from "path"

/**
 * 检查并确保指定路径数组中的每个路径的目录存在，如果不存在则创建该目录。
 *
 * @param {string[]} routes - 包含多个路径的数组，函数会遍历数组并确保每个路径的目录存在。
 */
export const isDir = async (routes: string[]) => {
  if (!routes.length) {
    // 日志里提示
    console.error("没有提供用于检查或创建目录的路径。")
    return
  }

  for (const route of routes) {
    // 获取指定路径的目录部分
    const tempDir = path.dirname(route)
    // 检查目录是否存在
    if (!fs.existsSync(tempDir)) {
      // 如果目录不存在，递归创建目录
      fs.mkdirSync(tempDir, { recursive: true })
    }
  }
}
