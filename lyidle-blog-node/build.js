const fs = require("fs")
const path = require("path")

// 输入和输出目录
const inputDirs = ["lyidleBlog/src"]

// 遍历目录获取所有文件
function getAllFiles(dirPath, fileTypes, fileList = []) {
  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileTypes, fileList)
    } else if (fileTypes.some((type) => file.endsWith(type))) {
      fileList.push(fullPath)
    }
  }
  return fileList
}

// 将路径转换为相对路径
function convertToRelativePath(importPath, filePath, srcBase) {
  if (!importPath.startsWith("@/")) return importPath

  const relativeImport = importPath.slice(2) // 去掉"@/"
  const absoluteImportPath = path.join(srcBase, relativeImport)
  const relativePath = path.relative(path.dirname(filePath), absoluteImportPath)
  // 确保路径使用正斜杠
  let result = relativePath.replace(/\\/g, "/")
  // 正则匹配不是以 ./ ../ /开头的结果 修改为相对路径
  const reg = /^(?!\.\/|\.{2}\/|\/).+/
  if (reg.test(result)) result = "./" + result
  return result
}

// 替换文件中的路径并写入新的位置
function processFile(filePath, srcBase) {
  const content = fs.readFileSync(filePath, "utf-8")
  const updatedContent = content.replace(/"@\/(.*?)"/g, (match, p1) => {
    const importPath = `@/${p1}`
    return `"${convertToRelativePath(importPath, filePath, srcBase)}"`
  })
  // 写回原文件
  fs.writeFileSync(filePath, updatedContent)
  // console.log(`Processed: ${filePath}`)
}

// 主函数
function main() {
  inputDirs.forEach((srcDir) => {
    const allFiles = getAllFiles(srcDir, [".js", ".ts"])

    allFiles.forEach((file) => {
      processFile(file, srcDir)
    })
  })
}

main()
