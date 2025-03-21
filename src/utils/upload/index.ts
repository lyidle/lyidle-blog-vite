import { postTempImgFiles } from "@/api/img"
import { cloneDeep } from "lodash-es"
import { nanoid } from "nanoid"

/**
 * 处理文件上传，返回符合类型限制的 File[]
 * @param type 文件类型限制（默认为 "image"）
 * @returns 返回符合类型限制的 File[]，如果未选择文件或类型不匹配，抛出错误
 */
export const clickUpload = async (type: string = "image"): Promise<File[]> => {
  const files = await clickVirtualFile() // 获取用户选择的文件列表

  // 过滤并检查文件类型
  const filteredFiles = files
    .map((item) => {
      if (!item.files.type.startsWith(type)) {
        // 如果文件类型不匹配，显示错误提示
        ElMessage.error(`文件 ${item.oldName} 类型错误，需要的类型为：${type}`)
        return
      }
      return item.files // 返回符合类型限制的文件
    })
    .filter(Boolean) as File[]

  // 如果没有符合类型的文件，抛出错误
  if (filteredFiles.length === 0) {
    throw new Error("没有符合类型的文件")
  }

  return filteredFiles // 返回符合类型限制的文件列表
}

/**
 * 模拟 input 多选文件上传
 * @returns 返回一个包含原文件名和新文件对象的数组，格式为 { oldName: string, files: File[] }[]
 */
export const clickVirtualFile = async (): Promise<
  { oldName: string; files: File }[]
> => {
  return new Promise((resolve, reject) => {
    // 创建一个 input 元素
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true // 允许选择多个文件

    // 监听 change 事件
    input.addEventListener("change", ($e: Event) => {
      const target = $e.target as HTMLInputElement // 断言为 HTMLInputElement
      const files = target.files // 获取用户选择的文件列表

      if (files && files.length > 0) {
        // 将 FileList 转换为数组，并处理每个文件
        const fileList = Array.from(files).map((file) => {
          const oldName = file.name // 保存原文件名
          const fileExtension = file.name.split(".").pop() // 提取文件扩展名
          const newFileName = `${nanoid()}.${fileExtension}` // 使用 nanoid 生成新文件名，并保留原扩展名
          // 创建新的 File 对象，保留原文件的类型和最后修改时间
          const newFile = new File([file], newFileName, {
            type: file.type,
            lastModified: file.lastModified,
          })

          return {
            oldName, // 原文件名
            files: newFile, // 新文件对象
          }
        })

        resolve(fileList) // 返回处理后的文件列表
      } else {
        reject(new Error("No files selected")) // 如果没有选择文件，返回错误
      }
    })

    // 触发文件选择对话框
    input.click()
  })
}

/**
 * 把 文件 对象 转成 需要的 md 语法 格式 进行 返回
 * @param files 文件对象 File[]
 * @return ![](1)![](2)
 */
export const fileToImgMd = (files: File[]) => {
  return cloneDeep(files)
    .map((item) => nameToMdImg(item.name))
    .filter(Boolean)
    .join("")
}

/**
 *
 * @param name 文件名
 * @returns 返回 md 格式的 图片字符串 ![](name)
 */
export const nameToMdImg = (name: string) => `![](${name})`
/**
 * 处理上传图片信息
 * @param file File[]
 */
export const tempFileUpload = async (
  files: File[]
): Promise<[string, string][] | undefined> => {
  try {
    // 调用 API 上传文件
    const response = await postTempImgFiles(files)
    for (const errorName of response.errFiles) {
      ElMessage.error(`上传文件${errorName}失败`)
    }
    const success = Object.entries(response.succMap)
    if (success.length) return success
  } catch (error) {
    console.log("上传图片失败~", error)
  }
}
