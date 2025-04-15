import { existsSync, readdirSync, statSync } from "fs"
import { basename, join } from "path"

interface FileNode {
  path: string
  name: string
  type: "file"
  size: number
  mtime: Date
  extension?: string
}

interface DirectoryNode {
  path: string
  name: string
  type: "directory"
  children: TreeNode[]
}

type TreeNode = FileNode | DirectoryNode

// 获取目录树结构
export const getDirectoryTree = (dirPath: string): DirectoryNode | null => {
  if (!existsSync(dirPath)) {
    console.warn(`目录不存在: ${dirPath}`)
    return null
  }

  const tree: DirectoryNode = {
    path: dirPath,
    name: basename(dirPath), // 使用 basename 获取纯目录名
    type: "directory",
    children: [],
  }

  const items = readdirSync(dirPath)

  items.forEach((item) => {
    const fullPath = join(dirPath, item)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      const childDir = getDirectoryTree(fullPath)
      if (childDir) {
        tree.children.push(childDir)
      }
    } else {
      tree.children.push({
        path: fullPath,
        name: basename(item), // 确保是纯文件名
        type: "file",
        size: stats.size,
        mtime: stats.mtime,
        extension: item.includes(".") ? item.split(".").pop() : undefined,
      })
    }
  })

  return tree
}
