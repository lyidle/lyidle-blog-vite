const fs = require("fs")
const path = require("path")
const Terser = require("terser")

// 设置 dist 目录路径
const distDir = path.join(__dirname, "dist")

// 获取 dist 目录下的所有文件
function getFilesInDir(dir) {
  let files = []
  const items = fs.readdirSync(dir)

  items.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files = files.concat(getFilesInDir(fullPath)) // 递归查找子目录
    } else if (item.endsWith(".ts") || item.endsWith(".js")) {
      files.push(fullPath)
    }
  })

  return files
}

// 压缩文件
async function minifyFile(file) {
  const code = fs.readFileSync(file, "utf8")

  try {
    const result = await Terser.minify(code, {
      compress: true,
      mangle: true,
    })
    if (result.error) {
      console.error(`Error minifying ${file}:`, result.error)
      return
    }

    // 将压缩后的代码写回文件
    fs.writeFileSync(file, result.code, "utf8")
    console.log(`Minified: ${file}`)
  } catch (error) {
    console.error(`Error minifying ${file}:`, error)
  }
}

// 主函数，遍历 dist 目录并压缩文件
async function minify() {
  const files = getFilesInDir(distDir)
  for (const file of files) {
    await minifyFile(file)
  }
}

minify().catch((err) => console.error("Minification failed:", err))
