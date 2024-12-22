const fs = require("fs")
const path = require("path")

// 获取当前脚本环境下的所有第一层目录
const directories = fs
  .readdirSync(path.resolve("."), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.resolve(dirent.name))

// 计算相对路径
function calculateRelativePath(from, to) {
  return path.relative(path.dirname(from), to).replace(/\\/g, "/") // 确保路径使用正斜杠
}

// 查找并替换的函数
function processFile(filePath, baseDirs) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error(`无法读取文件: ${filePath}`, err)
      return
    }

    // 查找以 "@/" 开头的路径
    const updatedContent = data.replace(/"@\/(.*)"/g, (match, p1) => {
      for (const baseDir of baseDirs) {
        const targetPath = path.resolve(baseDir, p1)
        if (fs.existsSync(targetPath)) {
          let relativePath = calculateRelativePath(filePath, targetPath)
          // 判断 处理后的路径是否 文件夹名开头的文件替换为 ./
          if (
            !relativePath.startsWith("./") &&
            !relativePath.startsWith("../") &&
            !relativePath.startsWith("/")
          ) {
            relativePath = "./" + relativePath
          }
          return `"${relativePath}"`
        }
      }
      console.warn(`未找到匹配路径: ${p1} in file: ${filePath}`)
      return match // 如果未找到匹配路径，则保留原样
    })

    if (updatedContent !== data) {
      fs.writeFile(filePath, updatedContent, "utf-8", (err) => {
        if (err) {
          console.error(`无法写入文件: ${filePath}`, err)
        } else {
          // console.log(`已处理文件: ${filePath}`)
        }
      })
    }
  })
}

// 遍历目录的函数
function traverseDirectory(dir, baseDirs) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      // console.error(`无法读取目录: ${dir}`, err)
      return
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file.name)

      if (file.isDirectory()) {
        traverseDirectory(fullPath, baseDirs)
      } else if (
        file.isFile() &&
        (file.name.endsWith(".js") || file.name.endsWith(".ts"))
      ) {
        processFile(fullPath, baseDirs)
      }
    })
  })
}

// 开始处理
directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    traverseDirectory(dir, directories)
  } else {
    console.warn(`目录不存在: ${dir}`)
  }
})
