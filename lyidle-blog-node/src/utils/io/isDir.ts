import { existsSync, mkdirSync } from "fs"
import { dirname, extname } from "path"

/**
 * 检查并确保指定路径数组中的每个路径的目录存在，如果不存在则创建该目录。
 *
 * @param {string[]} routes - 包含多个路径的数组，函数会遍历数组并确保每个路径的目录存在。
 */
export const isDir = async (routes: string[]) => {
  if (!routes.length) {
    console.error("没有提供用于检查或创建目录的路径。")
    return
  }

  for (const route of routes) {
    if (!route || typeof route !== "string") {
      console.error("isDir 传入的参数需要是一个 string[]", routes)
      continue
    }

    let path = route

    // 如果有扩展名，认为是文件，提取其所在目录
    if (extname(route)) {
      path = dirname(route)
    }

    // 检查目录是否存在，如果不存在则递归创建
    if (!existsSync(path)) {
      try {
        mkdirSync(path, { recursive: true })
      } catch (err) {
        console.error("创建目录失败:", path, err)
      }
    }
  }
}
